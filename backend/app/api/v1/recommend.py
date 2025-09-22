from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from app.core.config import settings
import os
import spotipy
from app.recommend.recommender import aggregate_targets
from app.services.spotify import get_recommendations, get_available_genres
from app.schemas.recommend import RecommendRequest, RecommendResponse, TrackInfo
from typing import List
from dotenv import load_dotenv
from pathlib import Path

# .env 파일 직접 로드
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(env_path)

router = APIRouter()
@router.get("/spotify/login")
async def spotify_login():
    client_id = os.getenv("SPOTIFY_CLIENT_ID") or settings.SPOTIFY_CLIENT_ID
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET") or settings.SPOTIFY_CLIENT_SECRET
    redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI") or settings.SPOTIFY_REDIRECT_URI
    scope = settings.SPOTIFY_SCOPES

    if not client_id or not client_secret:
        raise HTTPException(status_code=400, detail="Spotify credentials not configured")

    oauth = spotipy.oauth2.SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=scope,
        show_dialog=True,
    )
    auth_url = oauth.get_authorize_url()
    return RedirectResponse(auth_url)

@router.get("/spotify/callback")
async def spotify_callback(code: str):
    client_id = os.getenv("SPOTIFY_CLIENT_ID") or settings.SPOTIFY_CLIENT_ID
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET") or settings.SPOTIFY_CLIENT_SECRET
    redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI") or settings.SPOTIFY_REDIRECT_URI
    oauth = spotipy.oauth2.SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=settings.SPOTIFY_SCOPES,
    )
    token_info = oauth.get_access_token(code, as_dict=True)
    refresh_token = token_info.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Failed to obtain refresh token")
    # NOTE: For demo purposes, return it directly. In production, store securely.
    return {"refresh_token": refresh_token}


@router.post("/recommend", response_model=RecommendResponse)
async def get_music_recommendations(request: RecommendRequest):
    """
    Get music recommendations based on emotion analysis
    """
    try:
        # Convert Pydantic models to tuples for processing
        selected_emotions = [(emotion.label, emotion.probability) for emotion in request.selected]
        
        # Get target audio features and seeds from emotion analysis
        target, genre_seeds = aggregate_targets(selected_emotions)
        
        # Spotify API를 통한 추천
        spotify_result = get_recommendations(
            seed_genres=genre_seeds,
            limit=request.limit,
            target_valence=target.get("valence"),
            target_energy=target.get("energy"), 
            target_danceability=target.get("danceability"),
            target_acousticness=target.get("acousticness")
        )
        
        # 결과를 우리 스키마 형식에 맞게 변환
        tracks = []
        for track in spotify_result["tracks"]:
            track_info = TrackInfo(
                id=track["id"],
                name=track["name"],
                artists=track["artists"],
                album=track["album"],
                preview_url=track["preview_url"],
                external_urls=track["external_urls"],
                image_url=track["image_url"],
                duration_ms=track.get("duration_ms"),
                popularity=track.get("popularity", 0),
                explicit=track.get("explicit", False)
            )
            tracks.append(track_info)
        
        return RecommendResponse(
            target=target,
            seeds={"genres": genre_seeds},
            tracks=tracks,
            total=spotify_result["total"],
            spotify_params=spotify_result["parameters"]
        )
    
    except ValueError as e:
        # Spotify API 관련 에러
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # 기타 서버 에러
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")

@router.get("/genres")
async def get_supported_genres():
    """
    Get list of available genres from Spotify
    """
    try:
        genres = get_available_genres()
        return {"genres": genres, "total": len(genres)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting genres: {str(e)}")

@router.get("/test")
async def test_spotify_connection():
    """
    Test Spotify API connection
    """
    try:
        # 간단한 추천 요청으로 연결 테스트
        result = get_recommendations(
            seed_genres=["pop"],
            limit=1,
            target_valence=0.5
        )
        return {
            "status": "success",
            "message": "Spotify API connection is working",
            "sample_track": result["tracks"][0] if result["tracks"] else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spotify connection failed: {str(e)}")
