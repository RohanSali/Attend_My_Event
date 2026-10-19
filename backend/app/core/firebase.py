import os
from pathlib import Path
import firebase_admin
from firebase_admin import auth, credentials, firestore

BACKEND_DIR = Path(__file__).resolve().parents[2]
CREDENTIALS_PATH = (BACKEND_DIR / "service-account.json").resolve()

if not firebase_admin._apps:
    if CREDENTIALS_PATH.exists():
        cred = credentials.Certificate(str(CREDENTIALS_PATH))
        firebase_admin.initialize_app(cred)
    else:
        # Fallback to Application Default Credentials
        firebase_admin.initialize_app()

db: firestore.firestore.Client = firestore.client()
firebase_auth = auth