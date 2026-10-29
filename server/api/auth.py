"""
Auth blueprint.

POST /api/auth/verify
  Body: { "id_token": "<Firebase ID token>" }

Verifies the Google/Firebase ID token, then creates or updates the user
record in Firestore + SQLite, and returns the user profile.
"""

from flask import Blueprint, jsonify, request
from firebase_admin import auth as fb_auth
import db_sqlite as sqlite
from firebase_admin_init import get_db, is_available

auth_bp = Blueprint("auth", __name__)


def _upsert_user_firestore(db, user_data: dict):
    try:
        ref = db.collection("users").document(user_data["id"])
        doc = ref.get()
        if doc.exists:
            # Update mutable fields only
            ref.update({
                "email": user_data.get("email", ""),
                "avatar_url": user_data.get("avatar_url", ""),
            })
        else:
            ref.set(user_data)
    except Exception:
        pass


@auth_bp.route("/api/auth/verify", methods=["POST"])
def verify_token():
    body = request.get_json(force=True) or {}
    id_token = body.get("id_token", "")

    if not id_token:
        return jsonify({"error": "id_token is required"}), 400

    if not is_available():
        # Firestore unavailable — still try to verify via firebase-admin auth
        return jsonify({"error": "Firebase not configured on server"}), 503

    try:
        decoded = fb_auth.verify_id_token(id_token)
    except Exception as exc:
        return jsonify({"error": f"Invalid token: {exc}"}), 401

    uid = decoded["uid"]
    user_data = {
        "id": uid,
        "first_name": decoded.get("name", "").split(" ")[0] if decoded.get("name") else "",
        "last_name": " ".join(decoded.get("name", "").split(" ")[1:]) if decoded.get("name") else "",
        "email": decoded.get("email", ""),
        "avatar_url": decoded.get("picture", ""),
    }

    db = get_db()
    if db is not None:
        _upsert_user_firestore(db, user_data)

    sqlite.user_upsert(user_data)
    return jsonify(user_data)
