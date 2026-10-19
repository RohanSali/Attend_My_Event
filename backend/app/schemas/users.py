from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ProfileUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    display_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    city: Optional[str] = Field(default=None, max_length=120)
    age: Optional[int] = Field(default=None, ge=1, le=120)
    bio: Optional[str] = Field(default=None, max_length=1000)
    photo_url: Optional[str] = None


class ProfileResponse(BaseModel):
    uid: str
    email: Optional[str] = None
    display_name: Optional[str] = None
    city: Optional[str] = None
    age: Optional[int] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

