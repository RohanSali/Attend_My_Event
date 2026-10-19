from fastapi import APIRouter
from .routes import events, health, users

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(health.router)
api_v1_router.include_router(events.router)
api_v1_router.include_router(users.router)

