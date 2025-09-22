from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import analyze, recommend, diaries, auth
from app.core.config import settings
from app.db.base import engine, SessionLocal
from app.db.models import Base
from app.db import crud
from app.schemas.auth import UserCreate
from dotenv import load_dotenv
from pathlib import Path

# .env 파일 직접 로드 (최우선)
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(env_path)
print(f"Loading .env from: {env_path}")
print(f"Environment loaded: SPOTIFY_CLIENT_ID = {'Yes' if load_dotenv(env_path) else 'No'}")

# Initialize database (idempotent - do NOT drop tables)
try:
    print("Ensuring database schema...")
    Base.metadata.create_all(bind=engine)
    print("Database schema is ready.")
except Exception as e:
    print(f"Error ensuring database: {e}")

# Pre-load emotion model to avoid timeout on first request
try:
    from app.model.emotion_model import load_model
    print("Loading emotion model...")
    load_model()
    print("Emotion model loaded successfully!")
except Exception as e:
    print(f"Warning: Failed to preload emotion model: {e}")
    print("Model will be loaded on first request (may cause timeout)")

app = FastAPI(
    title=settings.APP_NAME,
    description="Emotion-aware music recommendation API",
    version="1.0.0"
)

# Seed default users on startup so login always works after restarts
@app.on_event("startup")
def seed_default_users() -> None:
    try:
        with SessionLocal() as db:
            if not crud.get_user_by_username(db, "aaaa"):
                crud.create_user(db, UserCreate(username="aaaa", password="123456"))
            # Optional second test user
            if not crud.get_user_by_username(db, "testuser2"):
                crud.create_user(db, UserCreate(username="testuser2", password="123456"))
            print("Default users ensured.")
    except Exception as e:
        print(f"Warning: failed to seed default users: {e}")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(analyze.router, prefix="/api/v1", tags=["emotions"])
app.include_router(recommend.router, prefix="/api/v1", tags=["recommendations"])
app.include_router(diaries.router, prefix="/api/v1", tags=["diaries"])

@app.get("/")
async def root():
    return {"message": "Emotion Music App API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
