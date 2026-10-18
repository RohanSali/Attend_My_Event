from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


class EventCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=3, max_length=100)
    category: str = Field(min_length=1, max_length=40)
    venue: str = Field(min_length=2, max_length=160)
    description: str = Field(default="", max_length=2000)
    starts_at: datetime
    ends_at: datetime

    @model_validator(mode="after")
    def validate_schedule(self) -> "EventCreate":
        if self.starts_at.utcoffset() is None or self.ends_at.utcoffset() is None:
            raise ValueError("Event start and end times must include a timezone.")
        if self.ends_at <= self.starts_at:
            raise ValueError("Event end time must be after the start time.")
        return self


class Event(EventCreate):
    id: str
    created_at: datetime
