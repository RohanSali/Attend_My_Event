import os
from pathlib import Path
import firebase_admin
from firebase_admin import auth, credentials, firestore

BACKEND_DIR = Path(__file__).resolve().parents[2]
credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
CREDENTIALS_PATH = (
    Path(credentials_path).expanduser().resolve()
    if credentials_path
    else (BACKEND_DIR / "service-account.json").resolve()
)

if not firebase_admin._apps:
    if CREDENTIALS_PATH.exists():
        cred = credentials.Certificate(str(CREDENTIALS_PATH))
        firebase_admin.initialize_app(cred)
    elif credentials_path:
        raise FileNotFoundError(
            f"Firebase credentials file does not exist: {CREDENTIALS_PATH}"
        )
    else:
        # Fallback to Application Default Credentials
        firebase_admin.initialize_app()

db: firestore.firestore.Client = firestore.client()
firebase_auth = auth