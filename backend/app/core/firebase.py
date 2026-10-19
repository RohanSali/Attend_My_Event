import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore

BACKEND_DIR = Path(__file__).resolve().parents[2]

CREDENTIALS_PATH = (
    BACKEND_DIR / "service-account.json"
).resolve()

if not firebase_admin._apps:
    cred = credentials.Certificate(str(CREDENTIALS_PATH))
    firebase_admin.initialize_app(cred)

db = firestore.client()