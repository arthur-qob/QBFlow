import os
import json
import logging

import firebase_admin
from firebase_admin import credentials, firestore as admin_firestore

logger = logging.getLogger(__name__)

_db = None
_firestore_available = False


_initialized = False

def _initialize():
    global _db, _firestore_available, _initialized

    if _initialized:
        return

    _initialized = True

    try:
        if not firebase_admin._apps:
            sa_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT")
            sa_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH", "serviceAccount.json")

            if sa_json:
                cred = credentials.Certificate(json.loads(sa_json))
            elif os.path.exists(sa_path):
                cred = credentials.Certificate(sa_path)
            else:
                cred = credentials.ApplicationDefault()

            firebase_admin.initialize_app(cred)

        _db = admin_firestore.client()
        _firestore_available = True
        logger.info("Firebase Admin initialized successfully.")
    except Exception as exc:
        logger.warning(
            "Firebase Admin could not be initialized (%s). "
            "Running in SQLite-only mode.",
            exc,
        )
        _firestore_available = False
        _db = None


def get_db():
    """Return the Firestore client, or None if unavailable."""
    if not _initialized:
        _initialize()
    return _db if _firestore_available else None


def is_available():
    if not _initialized:
        _initialize()
    return _firestore_available


# Trigger initialization at import time.
_initialize()
