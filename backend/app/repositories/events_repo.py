from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4
from google.cloud.firestore_v1 import FieldFilter
from ..core.firebase import db

EVENTS_COLLECTION = "events"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _doc_to_dict(doc) -> Dict[str, Any]:
    data = doc.to_dict() or {}
    data["id"] = doc.id
    for key, value in list(data.items()):
        if hasattr(value, "isoformat"):
            data[key] = value.isoformat()
    return data


def create_event(host_uid: str, host_name: str, payload: dict) -> Dict[str, Any]:
    now = _now_iso()
    doc_ref = db.collection(EVENTS_COLLECTION).document()
    data = {
        **payload,
        "host_uid": host_uid,
        "host_name": host_name or "Event Host",
        "status": payload.get("status") or "published",
        "created_at": now,
        "updated_at": now,
        "published_at": now if payload.get("status") != "draft" else None,
        "cancelled_at": None,
    }
    doc_ref.set(data)
    return {"id": doc_ref.id, **data}


def get_event(event_id: str) -> Optional[Dict[str, Any]]:
    doc = db.collection(EVENTS_COLLECTION).document(event_id).get()
    if not doc.exists:
        return None
    return _doc_to_dict(doc)


def update_event(event_id: str, updates: dict) -> Optional[Dict[str, Any]]:
    ref = db.collection(EVENTS_COLLECTION).document(event_id)
    doc = ref.get()
    if not doc.exists:
        return None
    updates["updated_at"] = _now_iso()
    ref.update(updates)
    return _doc_to_dict(ref.get())


def cancel_event(event_id: str) -> Optional[Dict[str, Any]]:
    now = _now_iso()
    ref = db.collection(EVENTS_COLLECTION).document(event_id)
    doc = ref.get()
    if not doc.exists:
        return None
    ref.update({"status": "cancelled", "cancelled_at": now, "updated_at": now})
    return _doc_to_dict(ref.get())


def delete_event(event_id: str) -> bool:
    ref = db.collection(EVENTS_COLLECTION).document(event_id)
    doc = ref.get()
    if not doc.exists:
        return False
    ref.delete()
    return True


def list_public_events(category: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
    col_ref = db.collection(EVENTS_COLLECTION)
    # Simple query to avoid needing composite indexes before developer sets them up
    docs = col_ref.limit(limit).stream()
    events = []
    for doc in docs:
        ev = _doc_to_dict(doc)
        if ev.get("visibility") == "private":
            continue
        if ev.get("status") == "draft":
            continue
        if category and category != "All categories" and ev.get("category") != category:
            continue
        events.append(ev)

    # Sort in memory by start_at
    events.sort(key=lambda x: x.get("start_at", ""))
    return events


def list_host_events(host_uid: str) -> List[Dict[str, Any]]:
    col_ref = db.collection(EVENTS_COLLECTION)
    query = col_ref.where(filter=FieldFilter("host_uid", "==", host_uid))
    docs = query.stream()
    events = [_doc_to_dict(d) for d in docs]
    events.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return events

