from datetime import datetime, timezone
from typing import Any, Dict, Optional
from ..core.firebase import db

USERS_COLLECTION = "users"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_profile(uid: str) -> Optional[Dict[str, Any]]:
    doc = db.collection(USERS_COLLECTION).document(uid).get()
    if not doc.exists:
        return None
    data = doc.to_dict() or {}
    data["uid"] = uid
    return data


def get_or_create_profile(
    uid: str,
    email: Optional[str] = None,
    display_name: Optional[str] = None,
    photo_url: Optional[str] = None,
) -> Dict[str, Any]:
    ref = db.collection(USERS_COLLECTION).document(uid)
    doc = ref.get()
    if doc.exists:
        data = doc.to_dict() or {}
        data["uid"] = uid
        return data

    now = _now_iso()
    profile = {
        "uid": uid,
        "email": email,
        "display_name": display_name or (email.split("@")[0] if email else "User"),
        "city": "",
        "age": None,
        "bio": "",
        "photo_url": photo_url,
        "created_at": now,
        "updated_at": now,
    }
    ref.set(profile)
    return profile


def update_profile(uid: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    ref = db.collection(USERS_COLLECTION).document(uid)
    doc = ref.get()
    now = _now_iso()
    if not doc.exists:
        profile = {
            "uid": uid,
            "created_at": now,
            "updated_at": now,
            **updates,
        }
        ref.set(profile)
        return profile

    updates["updated_at"] = now
    ref.update(updates)
    data = ref.get().to_dict() or {}
    data["uid"] = uid
    return data

