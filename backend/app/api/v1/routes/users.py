from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_uid, get_current_user
from app.repositories import users_repo
from app.schemas.users import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/me", tags=["users"])


@router.get("", response_model=ProfileResponse)
def get_my_profile(
    user: dict = Depends(get_current_user),
) -> dict:
    """Retrieve profile of the current authenticated user."""
    uid = user["uid"]
    profile = users_repo.get_profile(uid)
    if not profile:
        profile = users_repo.get_or_create_profile(
            uid=uid,
            email=user.get("email"),
            display_name=user.get("name") or user.get("display_name"),
            photo_url=user.get("picture"),
        )
    return profile


@router.post("", response_model=ProfileResponse)
def sync_my_profile(
    body: ProfileUpdate,
    user: dict = Depends(get_current_user),
) -> dict:
    """Ensure user profile exists and optionally update fields."""
    uid = user["uid"]
    profile = users_repo.get_or_create_profile(
        uid=uid,
        email=user.get("email"),
        display_name=body.display_name or user.get("name"),
        photo_url=body.photo_url or user.get("picture"),
    )
    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None}
    if updates:
        profile = users_repo.update_profile(uid, updates) or profile
    return profile


@router.patch("", response_model=ProfileResponse)
def update_my_profile(
    body: ProfileUpdate,
    uid: str = Depends(get_current_uid),
) -> dict:
    """Update profile fields (name, city, age, bio, etc.)."""
    updates = {k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None}
    updated = users_repo.update_profile(uid, updates)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "NOT_FOUND", "message": "Profile not found."},
        )
    return updated

