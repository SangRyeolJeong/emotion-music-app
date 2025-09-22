from pydantic_settings import BaseSettings
from typing import Optional
from pathlib import Path

# Anchor paths to the backend directory so they are stable regardless of CWD
BACKEND_DIR = Path(__file__).resolve().parents[2]
ENV_FILE_PATH = BACKEND_DIR / ".env"
DB_FILE_PATH = BACKEND_DIR / "emotion_app.db"

class Settings(BaseSettings):
    # Model settings
    MODEL_DIR: str = "./models/goemotions_bert"
    MAX_LEN: int = 256
    THRESHOLD: float = 0.30
    TOPK: int = 3

    # Database settings (absolute path anchored to backend directory)
    DATABASE_URL: str = f"sqlite:///{DB_FILE_PATH}"

    # Spotify settings
    SPOTIFY_CLIENT_ID: str = ""
    SPOTIFY_CLIENT_SECRET: str = ""
    SPOTIFY_REDIRECT_URI: str = "http://localhost:8000/api/v1/spotify/callback"
    SPOTIFY_SCOPES: str = (
        "user-read-playback-state user-modify-playback-state user-read-currently-playing"
    )
    SPOTIFY_REFRESH_TOKEN: Optional[str] = None

    # App settings
    APP_NAME: str = "Emotion Music App"
    DEBUG: bool = True
    
    class Config:
        # Use absolute .env path anchored to backend directory
        env_file = str(ENV_FILE_PATH)
        extra = "allow"

settings = Settings()
