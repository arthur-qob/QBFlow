"""Documents CRUD blueprint."""

import uuid
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

import db_sqlite as sqlite
from firebase_admin_init import get_db

documents_bp = Blueprint("documents", __name__)


def _fs_to_dict(doc):
    d = doc.to_dict()
    d["id"] = doc.id
    return d


def _now():
    return datetime.now(timezone.utc).isoformat()


@documents_bp.route("/api/documents", methods=["GET"])
def list_documents():
    client_id = request.args.get("client_id")
    db = get_db()
    if db is not None:
        try:
            q = db.collection("documents")
            if client_id:
                q = q.where("client_id", "==", client_id)
            docs = q.order_by("created_at", direction="DESCENDING").stream()
            return jsonify([_fs_to_dict(d) for d in docs])
        except Exception:
            pass
    return jsonify(sqlite.document_list(client_id))


@documents_bp.route("/api/documents/<doc_id>", methods=["GET"])
def get_document(doc_id):
    db = get_db()
    if db is not None:
        try:
            doc = db.collection("documents").document(doc_id).get()
            if doc.exists:
                return jsonify(_fs_to_dict(doc))
        except Exception:
            pass
    doc = sqlite.document_get(doc_id)
    if doc is None:
        return jsonify({"error": "Not found"}), 404
    return jsonify(doc)


@documents_bp.route("/api/documents", methods=["POST"])
def create_document():
    body = request.get_json(force=True) or {}
    doc_id = str(uuid.uuid4())
    now = _now()
    document = {
        "id": doc_id,
        "client_id": body.get("client_id", ""),
        "buyer_id": body.get("buyer_id", ""),
        "type": body.get("type", "packing_slip"),
        "invoice_number": body.get("invoice_number", ""),
        "invoice_date": body.get("invoice_date", ""),
        "status": body.get("status", "generated"),
        "created_at": now,
        "data": body.get("data", {}),
    }

    db = get_db()
    if db is not None:
        try:
            db.collection("documents").document(doc_id).set(document)
        except Exception:
            pass

    sqlite.document_create(document.copy())
    return jsonify(document), 201


@documents_bp.route("/api/documents/<doc_id>", methods=["DELETE"])
def delete_document(doc_id):
    db = get_db()
    if db is not None:
        try:
            db.collection("documents").document(doc_id).delete()
        except Exception:
            pass
    sqlite.document_delete(doc_id)
    return jsonify({"deleted": doc_id})
