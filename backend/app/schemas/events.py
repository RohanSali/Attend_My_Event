from datetime import datetime
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator

REGISTRATION_MODES = Literal["none", "in_app", "external", "contact_host"]
VISIBILITY_MODES = Literal["public", "private"]
EVENT_STATUS_MODES = Literal["draft", "published", "cancelled"]


class GeoPoint(BaseModel):
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)


class EventBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=3, max_length=120)
    category: str = Field(min_length=1, max_length=60)
    venue_name: str = Field(min_length=2, max_length=200)
    address_text: Optional[str] = Field(default="", max_length=500)
    location: Optional[GeoPoint] = None
    start_at: datetime
    end_at: datetime
    time_zone: Optional[str] = Field(default="UTC", max_length=60)
    description: Optional[str] = Field(default="", max_length=20000)
    visibility: VISIBILITY_MODES = "public"
    cover_image_url: Optional[str] = None
    registration_mode: REGISTRATION_MODES = "none"
    registration_url: Optional[str] = None
    capacity: Optional[int] = Field(default=None, ge=1)
    fee_amount: Optional[float] = Field(default=None, ge=0)
    currency: Optional[str] = Field(default="INR", max_length=10)
    payment_instructions: Optional[str] = None
    contact_details: Optional[str] = None


class EventCreate(EventBase):
    @model_validator(mode="after")
    def validate_schedule(self) -> "EventCreate":
        if self.end_at <= self.start_at:
            raise ValueError("Event end time must be after the start time.")
        return self


class EventUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: Optional[str] = Field(default=None, min_length=3, max_length=120)
    category: Optional[str] = Field(default=None, min_length=1, max_length=60)
    venue_name: Optional[str] = Field(default=None, min_length=2, max_length=200)
    address_text: Optional[str] = None
    location: Optional[GeoPoint] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    time_zone: Optional[str] = None
    description: Optional[str] = None
    visibility: Optional[VISIBILITY_MODES] = None
    cover_image_url: Optional[str] = None
    registration_mode: Optional[REGISTRATION_MODES] = None
    registration_url: Optional[str] = None
    capacity: Optional[int] = None
    fee_amount: Optional[float] = None
    currency: Optional[str] = None
    payment_instructions: Optional[str] = None
    contact_details: Optional[str] = None
    status: Optional[EVENT_STATUS_MODES] = None


class EventResponse(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: str
    host_uid: str
    host_name: Optional[str] = "Event Host"
    title: str
    category: str
    venue_name: str
    address_text: Optional[str] = ""
    location: Optional[Dict[str, float]] = None
    start_at: str
    end_at: str
    time_zone: Optional[str] = "UTC"
    description: Optional[str] = ""
    visibility: str = "public"
    status: str = "published"
    cover_image_url: Optional[str] = None
    registration_mode: str = "none"
    registration_url: Optional[str] = None
    capacity: Optional[int] = None
    fee_amount: Optional[float] = None
    currency: Optional[str] = "INR"
    payment_instructions: Optional[str] = None
    contact_details: Optional[str] = None
    created_at: str
    updated_at: str
    published_at: Optional[str] = None
    cancelled_at: Optional[str] = None

