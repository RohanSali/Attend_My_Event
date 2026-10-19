from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.security import get_current_uid, get_current_user, get_optional_uid
from app.repositories import events_repo, users_repo
from app.schemas.events import EventCreate, EventResponse, EventUpdate

router = APIRouter(prefix="/events", tags=["events"])


def _assert_owner(event: dict, uid: str) -> None:
    if event.get("host_uid") != uid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"code": "FORBIDDEN", "message": "You do not own this event."},
        )


@router.get("", response_model=List[EventResponse])
def list_events(
    category: Optional[str] = Query(default=None),
    limit: int = Query(default=100, ge=1, le=200),
) -> list:
    """List public published events."""
    return events_repo.list_public_events(category=category, limit=limit)


@router.get("/mine", response_model=List[EventResponse])
def list_my_events(uid: str = Depends(get_current_uid)) -> list:
    """List events created by the logged-in user."""
    return events_repo.list_host_events(host_uid=uid)


@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: str, current_uid: Optional[str] = Depends(get_optional_uid)) -> dict:
    ev = events_repo.get_event(event_id)
    if not ev:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Event not found."},
        )
    # Check visibility
    if ev.get("visibility") == "private" or ev.get("status") == "draft":
        if not current_uid or ev.get("host_uid") != current_uid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": "This event is private or not published."},
            )
    return ev


@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    body: EventCreate,
    user: dict = Depends(get_current_user),
) -> dict:
    """Create a new event."""
    uid = user["uid"]
    host_name = user.get("name") or user.get("display_name")
    if not host_name:
        # Check user profile
        prof = users_repo.get_profile(uid)
        if prof and prof.get("display_name"):
            host_name = prof["display_name"]
        else:
            host_name = user.get("email", "").split("@")[0] or "Event Host"

    payload = body.model_dump(mode="json")
    payload["start_at"] = body.start_at.isoformat()
    payload["end_at"] = body.end_at.isoformat()
    if body.location:
        payload["location"] = {"lat": body.location.lat, "lng": body.location.lng}

    return events_repo.create_event(host_uid=uid, host_name=host_name, payload=payload)


@router.patch("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: str,
    body: EventUpdate,
    uid: str = Depends(get_current_uid),
) -> dict:
    """Update event by its owner."""
    ev = events_repo.get_event(event_id)
    if not ev:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Event not found."},
        )
    _assert_owner(ev, uid)

    updates = {k: v for k, v in body.model_dump(mode="json", exclude_unset=True).items() if v is not None}
    if body.start_at:
        updates["start_at"] = body.start_at.isoformat()
    if body.end_at:
        updates["end_at"] = body.end_at.isoformat()
    if body.location:
        updates["location"] = {"lat": body.location.lat, "lng": body.location.lng}

    updated = events_repo.update_event(event_id, updates)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "UPDATE_FAILED", "message": "Failed to update event."},
        )
    return updated


@router.post("/{event_id}/cancel", response_model=EventResponse)
def cancel_event(event_id: str, uid: str = Depends(get_current_uid)) -> dict:
    """Cancel event."""
    ev = events_repo.get_event(event_id)
    if not ev:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Event not found."},
        )
    _assert_owner(ev, uid)
    updated = events_repo.cancel_event(event_id)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "CANCEL_FAILED", "message": "Failed to cancel event."},
        )
    return updated


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: str, uid: str = Depends(get_current_uid)) -> None:
    """Delete event."""
    ev = events_repo.get_event(event_id)
    if not ev:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Event not found."},
        )
    _assert_owner(ev, uid)
    events_repo.delete_event(event_id)

