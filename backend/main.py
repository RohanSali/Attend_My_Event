import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator
from uuid import uuid4

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, model_validator


DEFAULT_DATABASE_PATH = Path(__file__).resolve().parent / "events.sqlite3"
DATABASE_PATH = Path(os.getenv("EVENT_DATABASE_PATH", DEFAULT_DATABASE_PATH))
DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="AttendMyEvent API", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class EventCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=3, max_length=100)
    category: str = Field(min_length=1, max_length=40)
    venue: str = Field(min_length=2, max_length=160)
    description: str = Field(default="", max_length=2000)
    starts_at: datetime
    ends_at: datetime

    @model_validator(mode="after")
    def validate_schedule(self):
        if self.starts_at.utcoffset() is None or self.ends_at.utcoffset() is None:
            raise ValueError("Event start and end times must include a timezone.")
        if self.ends_at <= self.starts_at:
            raise ValueError("Event end time must be after the start time.")
        return self


class Event(EventCreate):
    id: str
    created_at: datetime


@contextmanager
def connect_database() -> Iterator[sqlite3.Connection]:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    try:
        with connection:
            yield connection
    finally:
        connection.close()


def initialize_database():
    with connect_database() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                venue TEXT NOT NULL,
                description TEXT NOT NULL,
                starts_at TEXT NOT NULL,
                ends_at TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


initialize_database()


@app.get("/")
def home():
    return {"message": "AttendMyEvent API is running."}


@app.get("/health")
def health():
    return {"success": "ok"}


@app.get("/events", response_model=list[Event])
def list_events():
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


@app.post("/events", response_model=Event, status_code=status.HTTP_201_CREATED)
def create_event(event: EventCreate):
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
