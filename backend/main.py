import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_v1_router
from app.api.v1.routes.events import router as events_direct_router
from app.api.v1.routes.health import router as health_direct_router
from app.api.v1.routes.users import router as users_direct_router

app = FastAPI(
    title="AttendMyEvent API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

allowed_origins_env = os.getenv("CORS_ORIGIN", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standard API v1 routes
app.include_router(api_v1_router)

# Direct aliases for Vite / Nginx proxy rewrites (where /api prefix is stripped)
app.include_router(events_direct_router)
app.include_router(users_direct_router)
app.include_router(health_direct_router)

# Direct /api aliases (for setups where /api is not rewritten)
app.include_router(events_direct_router, prefix="/api")
app.include_router(users_direct_router, prefix="/api")
app.include_router(health_direct_router, prefix="/api")


@app.get("/")
def home() -> dict:
    return {"message": "AttendMyEvent API is running.", "version": "2.0.0"}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
