"""Users CRUD blueprint."""

from flask import Blueprint, jsonify, request
import db_sqlite as sqlite
from firebase_admin_init import get_db

users_bp = Blueprint("users", __name__)


def _fs_to_dict(doc):
    d = doc.to_dict()
    d["id"] = doc.id
    return d


@users_bp.route("/api/users", methods=["GET"])
def list_users():
    db = get_db()
    if db is not None:
        try:
            docs = db.collection("users").stream()
            return jsonify([_fs_to_dict(d) for d in docs])
        except Exception:
            pass
    return jsonify(sqlite.user_list())


@users_bp.route("/api/users/<user_id>", methods=["GET"])
def get_user(user_id):
    db = get_db()
    if db is not None:
        try:
            doc = db.collection("users").document(user_id).get()
            if doc.exists:
                return jsonify(_fs_to_dict(doc))
        except Exception:
            pass
    user = sqlite.user_get(user_id)
    if user is None:
        return jsonify({"error": "Not found"}), 404
    return jsonify(user)


@users_bp.route("/api/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    body = request.get_json(force=True) or {}
    allowed = ["first_name", "last_name", "email", "avatar_url"]
    updates = {k: v for k, v in body.items() if k in allowed}

    db = get_db()
    if db is not None:
        try:
            db.collection("users").document(user_id).update(updates)
        except Exception:
            pass

    sqlite.user_update(user_id, updates)
    user = sqlite.user_get(user_id)
    return jsonify(user)


@users_bp.route("/api/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    db = get_db()
    if db is not None:
        try:
            db.collection("users").document(user_id).delete()
        except Exception:
            pass
    sqlite.user_delete(user_id)
    return jsonify({"deleted": user_id})
