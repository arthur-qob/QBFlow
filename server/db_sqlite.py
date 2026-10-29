"""
SQLite backup / fallback storage.

Schema mirrors Firestore collections:
  - clients, vendors, buyers  (same columns)
  - users
  - documents

All timestamps are stored as ISO-8601 strings.
"""

import os
import json
import sqlite3
import logging
from datetime import datetime, timezone
from contextlib import contextmanager

logger = logging.getLogger(__name__)

DB_PATH = os.environ.get("SQLITE_PATH", os.path.join(os.path.dirname(__file__), "qbflow.db"))

# ---------------------------------------------------------------------------
# Schema
# ---------------------------------------------------------------------------

_ENTITY_DDL = """
CREATE TABLE IF NOT EXISTS {table} (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL DEFAULT '',
    address     TEXT NOT NULL DEFAULT '',
    city        TEXT NOT NULL DEFAULT '',
    phone       TEXT NOT NULL DEFAULT '',
    email       TEXT NOT NULL DEFAULT '',
    website     TEXT NOT NULL DEFAULT '',
    logo_b64    TEXT NOT NULL DEFAULT '',
    color_theme TEXT NOT NULL DEFAULT '#4a5080',
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
);
"""

_USERS_DDL = """
CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    first_name  TEXT NOT NULL DEFAULT '',
    last_name   TEXT NOT NULL DEFAULT '',
    email       TEXT NOT NULL DEFAULT '',
    avatar_url  TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL
);
"""

_DOCUMENTS_DDL = """
CREATE TABLE IF NOT EXISTS documents (
    id             TEXT PRIMARY KEY,
    client_id      TEXT NOT NULL DEFAULT '',
    buyer_id       TEXT NOT NULL DEFAULT '',
    type           TEXT NOT NULL DEFAULT 'packing_slip',
    invoice_number TEXT NOT NULL DEFAULT '',
    invoice_date   TEXT NOT NULL DEFAULT '',
    status         TEXT NOT NULL DEFAULT 'generated',
    created_at     TEXT NOT NULL,
    data           TEXT NOT NULL DEFAULT '{}'
);
"""


def _get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def _conn_ctx():
    conn = _get_conn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    """Create all tables if they don't exist."""
    with _conn_ctx() as conn:
        for table in ("clients", "vendors", "buyers"):
            conn.execute(_ENTITY_DDL.format(table=table))
        conn.execute(_USERS_DDL)
        conn.execute(_DOCUMENTS_DDL)
    logger.info("SQLite DB initialised at %s", DB_PATH)


# ---------------------------------------------------------------------------
# Generic entity helpers (clients / vendors / buyers)
# ---------------------------------------------------------------------------

_ENTITY_COLUMNS = [
    "id", "name", "address", "city", "phone", "email",
    "website", "logo_b64", "color_theme", "created_at", "updated_at",
]


def _row_to_dict(row):
    return dict(row)


def entity_list(table: str):
    with _conn_ctx() as conn:
        rows = conn.execute(f"SELECT * FROM {table} ORDER BY name").fetchall()
    return [_row_to_dict(r) for r in rows]


def entity_get(table: str, entity_id: str):
    with _conn_ctx() as conn:
        row = conn.execute(f"SELECT * FROM {table} WHERE id = ?", (entity_id,)).fetchone()
    return _row_to_dict(row) if row else None


def entity_create(table: str, data: dict):
    now = datetime.now(timezone.utc).isoformat()
    data.setdefault("created_at", now)
    data.setdefault("updated_at", now)
    data.setdefault("color_theme", "#4a5080")
    cols = [c for c in _ENTITY_COLUMNS if c in data]
    placeholders = ", ".join("?" * len(cols))
    values = [data.get(c, "") for c in cols]
    with _conn_ctx() as conn:
        conn.execute(
            f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({placeholders})",
            values,
        )
    return data


def entity_update(table: str, entity_id: str, data: dict):
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    cols = [c for c in _ENTITY_COLUMNS if c in data and c != "id"]
    if not cols:
        return
    set_clause = ", ".join(f"{c} = ?" for c in cols)
    values = [data[c] for c in cols] + [entity_id]
    with _conn_ctx() as conn:
        conn.execute(f"UPDATE {table} SET {set_clause} WHERE id = ?", values)


def entity_delete(table: str, entity_id: str):
    with _conn_ctx() as conn:
        conn.execute(f"DELETE FROM {table} WHERE id = ?", (entity_id,))


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

_USER_COLUMNS = ["id", "first_name", "last_name", "email", "avatar_url", "created_at"]


def user_list():
    with _conn_ctx() as conn:
        rows = conn.execute("SELECT * FROM users ORDER BY last_name, first_name").fetchall()
    return [_row_to_dict(r) for r in rows]


def user_get(user_id: str):
    with _conn_ctx() as conn:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return _row_to_dict(row) if row else None


def user_upsert(data: dict):
    """Create or update a user (used by auth verify)."""
    now = datetime.now(timezone.utc).isoformat()
    data.setdefault("created_at", now)
    cols = [c for c in _USER_COLUMNS if c in data]
    placeholders = ", ".join("?" * len(cols))
    values = [data.get(c, "") for c in cols]
    update_cols = [c for c in cols if c != "id"]
    update_clause = ", ".join(f"{c} = excluded.{c}" for c in update_cols)
    with _conn_ctx() as conn:
        conn.execute(
            f"""INSERT INTO users ({', '.join(cols)}) VALUES ({placeholders})
                ON CONFLICT(id) DO UPDATE SET {update_clause}""",
            values,
        )
    return data


def user_update(user_id: str, data: dict):
    cols = [c for c in _USER_COLUMNS if c in data and c != "id"]
    if not cols:
        return
    set_clause = ", ".join(f"{c} = ?" for c in cols)
    values = [data[c] for c in cols] + [user_id]
    with _conn_ctx() as conn:
        conn.execute(f"UPDATE users SET {set_clause} WHERE id = ?", values)


def user_delete(user_id: str):
    with _conn_ctx() as conn:
        conn.execute("DELETE FROM users WHERE id = ?", (user_id,))


# ---------------------------------------------------------------------------
# Documents
# ---------------------------------------------------------------------------

_DOC_COLUMNS = [
    "id", "client_id", "buyer_id", "type", "invoice_number",
    "invoice_date", "status", "created_at", "data",
]


def document_list(client_id: str = None):
    with _conn_ctx() as conn:
        if client_id:
            rows = conn.execute(
                "SELECT * FROM documents WHERE client_id = ? ORDER BY created_at DESC",
                (client_id,),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM documents ORDER BY created_at DESC"
            ).fetchall()
    result = []
    for r in rows:
        d = _row_to_dict(r)
        d["data"] = json.loads(d.get("data") or "{}")
        result.append(d)
    return result


def document_get(doc_id: str):
    with _conn_ctx() as conn:
        row = conn.execute("SELECT * FROM documents WHERE id = ?", (doc_id,)).fetchone()
    if not row:
        return None
    d = _row_to_dict(row)
    d["data"] = json.loads(d.get("data") or "{}")
    return d


def document_create(data: dict):
    now = datetime.now(timezone.utc).isoformat()
    data.setdefault("created_at", now)
    data.setdefault("status", "generated")
    # Serialise nested data dict
    raw_data = data.get("data", {})
    data["data"] = json.dumps(raw_data) if isinstance(raw_data, dict) else raw_data
    cols = [c for c in _DOC_COLUMNS if c in data]
    placeholders = ", ".join("?" * len(cols))
    values = [data.get(c, "") for c in cols]
    with _conn_ctx() as conn:
        conn.execute(
            f"INSERT INTO documents ({', '.join(cols)}) VALUES ({placeholders})",
            values,
        )
    data["data"] = raw_data
    return data


def document_delete(doc_id: str):
    with _conn_ctx() as conn:
        conn.execute("DELETE FROM documents WHERE id = ?", (doc_id,))


# ---------------------------------------------------------------------------
# Bootstrap on import
# ---------------------------------------------------------------------------
init_db()
