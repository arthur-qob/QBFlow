"""
Generic CRUD blueprint factory for clients, vendors and buyers.

All three share the same Firestore/SQLite schema:
  id, name, address, city, phone, email, website,
  logo_b64, color_theme, created_at, updated_at
"""

import uuid
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

import db_sqlite as sqlite
from firebase_admin_init import get_db


def _now():
    return datetime.now(timezone.utc).isoformat()


def _fs_to_dict(doc_snapshot):
    d = doc_snapshot.to_dict()
    d["id"] = doc_snapshot.id
    return d


def make_entity_blueprint(name: str, collection: str) -> Blueprint:
    """Return a Flask Blueprint with full CRUD for the given Firestore collection."""

    bp = Blueprint(name, __name__)

    # ------------------------------------------------------------------
    # LIST
    # ------------------------------------------------------------------
    @bp.route(f"/api/{name}", methods=["GET"])
    def list_entities():
        db = get_db()
        if db is not None:
            try:
                docs = db.collection(collection).order_by("name").stream()
                entities = [_fs_to_dict(d) for d in docs]
                return jsonify(entities)
            except Exception:
                pass
        # Fallback to SQLite
        return jsonify(sqlite.entity_list(collection))

    # ------------------------------------------------------------------
    # GET ONE
    # ------------------------------------------------------------------
    @bp.route(f"/api/{name}/<entity_id>", methods=["GET"])
    def get_entity(entity_id):
        db = get_db()
        if db is not None:
            try:
                doc = db.collection(collection).document(entity_id).get()
                if doc.exists:
                    return jsonify(_fs_to_dict(doc))
            except Exception:
                pass
        entity = sqlite.entity_get(collection, entity_id)
        if entity is None:
            return jsonify({"error": "Not found"}), 404
        return jsonify(entity)

    # ------------------------------------------------------------------
    # CREATE
    # ------------------------------------------------------------------
    @bp.route(f"/api/{name}", methods=["POST"])
    def create_entity():
        body = request.get_json(force=True) or {}
        entity_id = str(uuid.uuid4())
        now = _now()
        entity = {
            "id": entity_id,
            "name": body.get("name", ""),
            "address": body.get("address", ""),
            "city": body.get("city", ""),
            "phone": body.get("phone", ""),
            "email": body.get("email", ""),
            "website": body.get("website", ""),
            "logo_b64": body.get("logo_b64", ""),
            "color_theme": body.get("color_theme", "#4a5080"),
            "created_at": now,
            "updated_at": now,
        }

        # Write to Firestore
        db = get_db()
        if db is not None:
            try:
                db.collection(collection).document(entity_id).set(entity)
            except Exception:
                pass

        # Always write to SQLite
        sqlite.entity_create(collection, entity.copy())
        return jsonify(entity), 201

    # ------------------------------------------------------------------
    # UPDATE
    # ------------------------------------------------------------------
    @bp.route(f"/api/{name}/<entity_id>", methods=["PUT"])
    def update_entity(entity_id):
        body = request.get_json(force=True) or {}
        allowed = ["name", "address", "city", "phone", "email", "website", "logo_b64", "color_theme"]
        updates = {k: v for k, v in body.items() if k in allowed}
        updates["updated_at"] = _now()

        db = get_db()
        if db is not None:
            try:
                db.collection(collection).document(entity_id).update(updates)
            except Exception:
                pass

        sqlite.entity_update(collection, entity_id, updates)

        # Return the full updated entity
        entity = sqlite.entity_get(collection, entity_id)
        if entity is None:
            return jsonify({"error": "Not found"}), 404
        return jsonify(entity)

    # ------------------------------------------------------------------
    # DELETE
    # ------------------------------------------------------------------
    @bp.route(f"/api/{name}/<entity_id>", methods=["DELETE"])
    def delete_entity(entity_id):
        db = get_db()
        if db is not None:
            try:
                db.collection(collection).document(entity_id).delete()
            except Exception:
                pass

        sqlite.entity_delete(collection, entity_id)
        return jsonify({"deleted": entity_id})

    return bp


# ---------------------------------------------------------------------------
# Instantiate the three blueprints
# ---------------------------------------------------------------------------
clients_bp = make_entity_blueprint("clients", "clients")
vendors_bp = make_entity_blueprint("vendors", "vendors")
buyers_bp = make_entity_blueprint("buyers", "buyers")
