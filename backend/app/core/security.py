from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from .firebase import firebase_auth

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> dict:
    """Verify Firebase ID token and return decoded token info."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "UNAUTHENTICATED", "message": "Authentication required."},
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_TOKEN", "message": "Invalid or expired Firebase token."},
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_current_uid(
    user: dict = Depends(get_current_user),
) -> str:
    return user["uid"]


async def get_optional_uid(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Optional[str]:
    if not credentials or not credentials.credentials:
        return None
    try:
        decoded_token = firebase_auth.verify_id_token(credentials.credentials)
        return decoded_token.get("uid")
    except Exception:
        return None

