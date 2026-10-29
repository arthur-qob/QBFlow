import io
import os
import base64
import json
import queue
import threading
import tempfile
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, send_file, jsonify, render_template, Response, stream_with_context
from flask_cors import CORS

from load_excel import load_excel
from prep_data import prepare_data
from load_invoice_excel import load_invoice_excel
from prep_invoice_data import prepare_invoice_data
from render_html import render_html
from generate import generate_pdf
from extract_pdf import extract_items_from_invoice, dataframe_to_excel_bytes

# API blueprints
from api.entity_crud import clients_bp, vendors_bp, buyers_bp
from api.users import users_bp
from api.documents import documents_bp
from api.auth import auth_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprints
for bp in (clients_bp, vendors_bp, buyers_bp, users_bp, documents_bp, auth_bp):
    app.register_blueprint(bp)

# In-memory store for PDF extraction jobs
_pdf_jobs: dict = {}
_pdf_jobs_lock = threading.Lock()


def _format_invoice_date(date_str):
    """Convert YYYY-MM-DD (from HTML date input) to MM/DD/YYYY."""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%m/%d/%Y")
    except ValueError:
        return date_str


def _save_logo(logo_file=None, logo_b64: str = None, prefix: str = "logo") -> str | None:
    """
    Persist a logo to a temp file and return the path.
    Accepts either a file-like upload object or a base64 string.
    Returns None if nothing was provided.
    """
    if logo_file and logo_file.filename:
        ext = os.path.splitext(logo_file.filename)[1]
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
        logo_file.save(tmp.name)
        tmp.close()
        return tmp.name

    if logo_b64:
        # Strip possible data-URL prefix
        if "," in logo_b64:
            logo_b64 = logo_b64.split(",", 1)[1]
        try:
            raw = base64.b64decode(logo_b64)
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".png", prefix=prefix)
            tmp.write(raw)
            tmp.close()
            return tmp.name
        except Exception:
            pass

    return None


# ---------------------------------------------------------------------------
# Legacy template routes (kept for backwards-compat / direct browser access)
# ---------------------------------------------------------------------------

@app.route("/", methods=["GET"])
def index():
    return render_template("form.html")


@app.route("/invoice", methods=["GET"])
def invoice_form():
    return render_template("invoice_form.html")


# ---------------------------------------------------------------------------
# PDF Generation endpoints
# ---------------------------------------------------------------------------

@app.route("/generate", methods=["POST"])
def generate():
    if "excel_file" not in request.files:
        return "No file provided", 400

    file = request.files["excel_file"]
    if not file.filename.lower().endswith((".xlsx", ".xls")):
        return "File must be an Excel file (.xlsx or .xls)", 400

    date_format = request.form.get("date_format", "day_month_year")
    df = load_excel(file, date_format=date_format)
    data = prepare_data(df)

    # Logo: prefer uploaded file, fallback to base64 from client record
    logo_path = _save_logo(
        logo_file=request.files.get("logo_file"),
        logo_b64=request.form.get("logo_b64", ""),
        prefix="packing_slip_logo_",
    )

    data.update({
        "company_name": request.form.get("company_name", "TECHNICARE USA LLC"),
        "company_address": request.form.get("company_address", "2350 NW 93rd Ave"),
        "company_city": request.form.get("company_city", "Doral, FL 33172 US"),
        "company_phone": request.form.get("company_phone", "+17867475565"),
        "company_email": request.form.get("company_email", "operations@technicareusa.com"),
        "company_website": request.form.get("company_website", "www.technicareusa.com"),
        "bill_to": request.form.get("bill_to", ""),
        "ship_to": request.form.get("ship_to", ""),
        "invoice_number": request.form.get("invoice_number", "022-26"),
        "invoice_date": _format_invoice_date(request.form.get("invoice_date", "")),
        "packing_info": request.form.get("packing_info", ""),
        "net_weight": request.form.get("net_weight", ""),
        "gross_weight": request.form.get("gross_weight", ""),
        "weight_unit": request.form.get("weight_unit", "lbs"),
        "incoterm": request.form.get("incoterm", "CPT"),
        "terms": request.form.get("terms", ""),
        "logo_path": logo_path,
        "show_net_weight": request.form.get("show_net_weight") == "on",
        "accent_color": request.form.get("accent_color", "#4a5080"),
    })

    html = render_html(data)
    pdf_bytes = generate_pdf(html)

    if logo_path and os.path.exists(logo_path):
        try:
            os.remove(logo_path)
        except OSError:
            pass

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        download_name="packing_slip.pdf",
    )


@app.route("/generate-invoice", methods=["POST"])
def generate_invoice():
    if "excel_file" not in request.files:
        return "No file provided", 400

    file = request.files["excel_file"]
    if not file.filename.lower().endswith((".xlsx", ".xls")):
        return "File must be an Excel file (.xlsx or .xls)", 400

    df = load_invoice_excel(file)
    shipping = float(request.form.get("shipping_cost", 0) or 0)
    data = prepare_invoice_data(df, shipping=shipping)

    logo_path = _save_logo(
        logo_file=request.files.get("logo_file"),
        logo_b64=request.form.get("logo_b64", ""),
        prefix="invoice_logo_",
    )

    data.update({
        "company_name": request.form.get("company_name", "TECHNICARE USA LLC"),
        "company_address": request.form.get("company_address", "2350 NW 93rd Ave"),
        "company_city": request.form.get("company_city", "Doral, FL 33172 US"),
        "company_phone": request.form.get("company_phone", "+17867475565"),
        "company_email": request.form.get("company_email", "operations@technicareusa.com"),
        "company_website": request.form.get("company_website", "www.technicareusa.com"),
        "bill_to": request.form.get("bill_to", ""),
        "ship_to": request.form.get("ship_to", ""),
        "invoice_number": request.form.get("invoice_number", ""),
        "invoice_date": _format_invoice_date(request.form.get("invoice_date", "")),
        "due_date": _format_invoice_date(request.form.get("due_date", "")),
        "terms": request.form.get("terms", ""),
        "incoterm": request.form.get("incoterm", "CPT"),
        "currency": request.form.get("currency", "USD"),
        "payment_info": request.form.get("payment_info", ""),
        "logo_path": logo_path,
        "accent_color": request.form.get("accent_color", "#4a5080"),
    })

    html = render_html(data, template_name="invoice.html")
    pdf_bytes = generate_pdf(html)

    if logo_path and os.path.exists(logo_path):
        try:
            os.remove(logo_path)
        except OSError:
            pass

    invoice_number = data["invoice_number"]
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        download_name=f"Invoice {invoice_number}.pdf",
    )


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.route("/health", methods=["GET"])
def health():
    from firebase_admin_init import is_available
    return jsonify({"status": "ok", "firestore": is_available()})


# ---------------------------------------------------------------------------
# PDF → Excel extraction (SSE streaming)
# ---------------------------------------------------------------------------

@app.route("/extract-pdf/start", methods=["POST"])
def extract_pdf_start():
    if "invoice_file" not in request.files:
        return jsonify({"error": "No invoice file provided"}), 400

    invoice_file = request.files["invoice_file"]
    if not invoice_file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Invoice file must be a PDF"}), 400

    invoice_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    invoice_file.save(invoice_tmp.name)
    invoice_tmp.close()

    cert_tmp_path = None
    if "certificate_file" in request.files:
        cert_file = request.files["certificate_file"]
        if cert_file and cert_file.filename.lower().endswith(".pdf"):
            cert_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
            cert_file.save(cert_tmp.name)
            cert_tmp.close()
            cert_tmp_path = cert_tmp.name

    job_id = os.urandom(8).hex()
    job_queue: queue.Queue = queue.Queue()

    with _pdf_jobs_lock:
        _pdf_jobs[job_id] = {"queue": job_queue, "result": None, "error": None}

    def _run():
        try:
            def _progress(current, total, message):
                pct = int((current / total) * 100) if total > 0 else 0
                job_queue.put({"current": current, "total": total, "percentage": pct, "message": message})

            df = extract_items_from_invoice(
                invoice_tmp.name,
                certificate_file=cert_tmp_path,
                progress_cb=_progress,
            )

            if df is None or df.empty:
                job_queue.put({"error": "No data extracted from PDF"})
                with _pdf_jobs_lock:
                    _pdf_jobs[job_id]["error"] = "No data extracted from PDF"
            else:
                excel_bytes = dataframe_to_excel_bytes(df)
                with _pdf_jobs_lock:
                    _pdf_jobs[job_id]["result"] = excel_bytes
                job_queue.put({"done": True, "rowCount": len(df)})

        except Exception as exc:
            job_queue.put({"error": str(exc)})
            with _pdf_jobs_lock:
                _pdf_jobs[job_id]["error"] = str(exc)
        finally:
            try:
                os.remove(invoice_tmp.name)
            except OSError:
                pass
            if cert_tmp_path:
                try:
                    os.remove(cert_tmp_path)
                except OSError:
                    pass

    threading.Thread(target=_run, daemon=True).start()
    return jsonify({"job_id": job_id})


@app.route("/extract-pdf/stream/<job_id>", methods=["GET"])
def extract_pdf_stream(job_id):
    with _pdf_jobs_lock:
        job = _pdf_jobs.get(job_id)

    if job is None:
        return jsonify({"error": "Job not found"}), 404

    def _generate():
        job_queue = job["queue"]
        while True:
            try:
                msg = job_queue.get(timeout=60)
            except queue.Empty:
                yield 'data: {"error": "Timeout waiting for processing"}\n\n'
                break
            yield f"data: {json.dumps(msg)}\n\n"
            if "done" in msg or "error" in msg:
                break

    return Response(
        stream_with_context(_generate()),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.route("/extract-pdf/result/<job_id>", methods=["GET"])
def extract_pdf_result(job_id):
    with _pdf_jobs_lock:
        job = _pdf_jobs.pop(job_id, None)

    if job is None:
        return jsonify({"error": "Job not found or already downloaded"}), 404
    if job.get("error"):
        return jsonify({"error": job["error"]}), 500
    result = job.get("result")
    if result is None:
        return jsonify({"error": "Job not complete yet"}), 202

    return send_file(
        io.BytesIO(result),
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        download_name="extracted_data.xlsx",
        as_attachment=True,
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
