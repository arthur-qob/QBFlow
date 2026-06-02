import io
import os
import tempfile
from datetime import datetime
from flask import Flask, request, send_file, jsonify, render_template
from load_excel import load_excel
from prep_data import prepare_data
from load_invoice_excel import load_invoice_excel
from prep_invoice_data import prepare_invoice_data
from render_html import render_html
from generate import generate_pdf

app = Flask(__name__)


def _format_invoice_date(date_str):
    """Convert YYYY-MM-DD (from HTML date input) to MM/DD/YYYY."""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%m/%d/%Y")
    except ValueError:
        return date_str


@app.route("/", methods=["GET"])
def index():
    return render_template("form.html")


@app.route("/generate", methods=["POST"])
def generate():
    # Check file
    if "excel_file" not in request.files:
        return "No file provided", 400

    file = request.files["excel_file"]

    if not file.filename.lower().endswith((".xlsx", ".xls")):
        return "File must be an Excel file (.xlsx or .xls)", 400

    # Load and prepare data
    date_format = request.form.get("date_format", "day_month_year")
    df = load_excel(file, date_format=date_format)
    data = prepare_data(df)

    # Handle logo upload if provided
    logo_path = None
    if "logo_file" in request.files:
        logo_file = request.files["logo_file"]
        if logo_file and logo_file.filename:
            # Save logo to a temporary location
            temp_dir = tempfile.gettempdir()
            logo_filename = f"packing_slip_logo_{os.urandom(4).hex()}{os.path.splitext(logo_file.filename)[1]}"
            logo_path = os.path.join(temp_dir, logo_filename)
            logo_file.save(logo_path)

    # Add header data from form
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
        "incoterm": request.form.get("incoterm", "CPT"),
        "terms": request.form.get("terms", ""),
        "logo_path": logo_path,
        "show_net_weight": request.form.get("show_net_weight") == "on",
    })

    # Render HTML and generate PDF
    html = render_html(data)
    pdf_bytes = generate_pdf(html)

    # Clean up logo file if it was uploaded
    if logo_path and os.path.exists(logo_path):
        try:
            os.remove(logo_path)
        except:
            pass

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        download_name="packing_slip.pdf",
    )


@app.route("/invoice", methods=["GET"])
def invoice_form():
    return render_template("invoice_form.html")


@app.route("/generate-invoice", methods=["POST"])
def generate_invoice():
    # Validate file
    if "excel_file" not in request.files:
        return "No file provided", 400

    file = request.files["excel_file"]
    if not file.filename.lower().endswith((".xlsx", ".xls")):
        return "File must be an Excel file (.xlsx or .xls)", 400

    # Load and prepare data
    df = load_invoice_excel(file)
    shipping = float(request.form.get("shipping_cost", 0) or 0)
    data = prepare_invoice_data(df, shipping=shipping)

    # Handle logo upload
    logo_path = None
    if "logo_file" in request.files:
        logo_file = request.files["logo_file"]
        if logo_file and logo_file.filename:
            temp_dir = tempfile.gettempdir()
            logo_filename = f"invoice_logo_{os.urandom(4).hex()}{os.path.splitext(logo_file.filename)[1]}"
            logo_path = os.path.join(temp_dir, logo_filename)
            logo_file.save(logo_path)

    # Merge form fields
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
    })

    # Render HTML and generate PDF
    html = render_html(data, template_name="invoice.html")
    pdf_bytes = generate_pdf(html)

    # Clean up temp logo
    if logo_path and os.path.exists(logo_path):
        try:
            os.remove(logo_path)
        except Exception:
            pass

    invoice_number = data["invoice_number"]
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        download_name=f"Invoice {invoice_number}.pdf",
    )


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
