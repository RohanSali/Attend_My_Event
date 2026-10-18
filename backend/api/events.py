import sqlite3
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status

from database import connect_database
from schemas import Event, EventCreate


router = APIRouter(prefix="/events", tags=["events"])


@router.get("", response_model=list[Event])
def list_events() -> list[dict[str, str]]:
    now = datetime.now(timezone.utc).isoformat(timespec="microseconds")
    with connect_database() as connection:
        rows = connection.execute(
            """
            SELECT id, title, category, venue, description, starts_at, ends_at, created_at
            FROM events
            ORDER BY
                CASE WHEN starts_at >= ? THEN 0 ELSE 1 END,
                CASE WHEN starts_at >= ? THEN starts_at END ASC,
                CASE WHEN starts_at < ? THEN starts_at END DESC,
                created_at DESC
            """,
            (now, now, now),
        ).fetchall()
    return [dict(row) for row in rows]


@router.post("", response_model=Event, status_code=status.HTTP_201_CREATED)
def create_event(event: EventCreate) -> dict[str, object]:
    created_at = datetime.now(timezone.utc)
    event_id = str(uuid4())
    values = event.model_dump()
    values.update(
        id=event_id,
        starts_at=event.starts_at.astimezone(timezone.utc).isoformat(timespec="microseconds"),
        ends_at=event.ends_at.astimezone(timezone.utc).isoformat(timespec="microseconds"),
        created_at=created_at.isoformat(timespec="microseconds"),
    )

    try:
        with connect_database() as connection:
            connection.execute(
                """
                INSERT INTO events (
                    id, title, category, venue, description,
                    starts_at, ends_at, created_at
                ) VALUES (
                    :id, :title, :category, :venue, :description,
                    :starts_at, :ends_at, :created_at
                )
                """,
                values,
            )
    except sqlite3.Error as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save the event.",
        ) from error

    return values
