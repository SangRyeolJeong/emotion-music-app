import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from spotipy.exceptions import SpotifyException
from app.core.config import settings
import logging
import time
import base64
import requests
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import Dict, List, Optional, Any

# .env 파일 직접 로드
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(env_path)

logger = logging.getLogger(__name__)

_sp: spotipy.Spotify = None
_app_token: Optional[str] = None
_app_token_expires_at: float = 0.0

def get_spotify():
    """
    Spotify Client Credentials Flow (기본) 또는 Refresh Token (있을 때)로 클라이언트를 생성합니다.
    """
    global _sp
    if _sp is None:
        client_id = os.getenv("SPOTIFY_CLIENT_ID") or settings.SPOTIFY_CLIENT_ID
        client_secret = os.getenv("SPOTIFY_CLIENT_SECRET") or settings.SPOTIFY_CLIENT_SECRET
        refresh_token = os.getenv("SPOTIFY_REFRESH_TOKEN") or settings.SPOTIFY_REFRESH_TOKEN
        redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI") or settings.SPOTIFY_REDIRECT_URI

        if not client_id or not client_secret:
            raise ValueError("Spotify credentials not configured. Set SPOTIFY_CLIENT_ID/SECRET in .env")

        try:
            if refresh_token:
                # Use OAuth with refresh token if provided
                auth_manager = spotipy.oauth2.SpotifyOAuth(
                    client_id=client_id,
                    client_secret=client_secret,
                    redirect_uri=redirect_uri,
                    scope=settings.SPOTIFY_SCOPES,
                )
                # Manually set the cached token using the provided refresh token
                token_info = auth_manager.refresh_access_token(refresh_token)
                _sp = spotipy.Spotify(auth=token_info["access_token"])
            else:
                # Fallback to client credentials
                auth_manager = SpotifyClientCredentials(
                    client_id=client_id,
                    client_secret=client_secret
                )
                _sp = spotipy.Spotify(auth_manager=auth_manager)

            # 연결 테스트
            _sp.search(q="test", type="track", limit=1)
            logger.info("Spotify API connection established successfully")

        except SpotifyException as e:
            logger.error(f"Spotify API error: {e}")
            raise ValueError(f"Failed to authenticate with Spotify: {e}")
        except Exception as e:
            logger.error(f"Unexpected error initializing Spotify client: {e}")
            raise ValueError(f"Failed to initialize Spotify client: {e}")

    return _sp

def _basic_auth_header() -> Dict[str, str]:
    client_id = os.getenv("SPOTIFY_CLIENT_ID") or settings.SPOTIFY_CLIENT_ID
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET") or settings.SPOTIFY_CLIENT_SECRET
    creds = f"{client_id}:{client_secret}".encode("utf-8")
    return {
        "Authorization": "Basic " + base64.b64encode(creds).decode("utf-8"),
        "Content-Type": "application/x-www-form-urlencoded",
    }

def _ensure_app_token() -> str:
    global _app_token, _app_token_expires_at
    client_id = os.getenv("SPOTIFY_CLIENT_ID") or settings.SPOTIFY_CLIENT_ID
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET") or settings.SPOTIFY_CLIENT_SECRET
    if not client_id or not client_secret:
        raise ValueError("Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env file")
    now = time.time()
    if _app_token and now < (_app_token_expires_at - 30):
        return _app_token
    resp = requests.post(
        "https://accounts.spotify.com/api/token",
        headers=_basic_auth_header(),
        data={"grant_type": "client_credentials"},
        timeout=15,
    )
    if resp.status_code != 200:
        raise ValueError(f"Failed to obtain Spotify token: {resp.status_code} {resp.text}")
    payload = resp.json()
    _app_token = payload.get("access_token")
    expires_in = int(payload.get("expires_in", 3600))
    _app_token_expires_at = now + expires_in
    return _app_token

def get_recommendations(
    seed_genres: List[str] = None,
    seed_artists: List[str] = None,
    seed_tracks: List[str] = None,
    limit: int = 20,
    target_valence: Optional[float] = None,
    target_energy: Optional[float] = None,
    target_danceability: Optional[float] = None,
    target_acousticness: Optional[float] = None,
    **kwargs
) -> Dict[str, Any]:
    """
    검색 기반 음악 추천 (Client Credentials Flow 호환)
    다양성을 위해 여러 검색 쿼리를 사용하고 요청된 개수만큼 반환
    """
    import random
    
    try:
        all_tracks = []
        used_track_ids = set()
        
        # 다양한 검색 쿼리 생성
        search_queries = []
        
        # 기본 장르 기반 검색
        if seed_genres:
            for genre in seed_genres[:3]:  # 최대 3개 장르
                search_queries.append(genre)
        
        # 감정 상태에 따른 추가 검색어 조합
        emotion_terms = []
        if target_valence is not None:
            if target_valence > 0.7:
                emotion_terms.extend(["happy", "uplifting", "cheerful", "joyful"])
            elif target_valence < 0.3:
                emotion_terms.extend(["sad", "melancholy", "emotional", "mellow"])
            else:
                emotion_terms.extend(["calm", "peaceful", "relaxed"])
                
        if target_energy is not None:
            if target_energy > 0.7:
                emotion_terms.extend(["upbeat", "energetic", "dance", "party"])
            elif target_energy < 0.3:
                emotion_terms.extend(["slow", "acoustic", "ambient", "chill"])
        
        # 감정 기반 검색 쿼리 추가
        for term in emotion_terms[:4]:  # 최대 4개 감정 용어
            search_queries.append(term)
        
        # 다양성을 위한 추가 검색어 (무작위 선택)
        variety_terms = ["indie", "alternative", "folk", "electronic", "rock", "jazz", "soul", "r&b"]
        search_queries.extend(random.sample(variety_terms, min(3, len(variety_terms))))
        
        # 검색어가 없으면 기본값 사용
        if not search_queries:
            search_queries = ["pop", "music", "indie", "alternative"]
        
        # 무작위로 섞어서 다양성 증가
        random.shuffle(search_queries)
        
        sp = get_spotify()
        
        # 여러 검색 쿼리로 트랙 수집
        for query in search_queries:
            if len(all_tracks) >= limit:
                break
                
            try:
                # 각 검색마다 적은 수의 결과를 가져와서 다양성 증가
                search_limit = min(10, limit - len(all_tracks) + 5)
                results = sp.search(q=query, type="track", limit=search_limit)
                
                for track in results["tracks"]["items"]:
                    if track.get("id") and track["id"] not in used_track_ids:
                        used_track_ids.add(track["id"])
                        all_tracks.append({
                            "id": track.get("id"),
                            "name": track.get("name"),
                            "artists": [a.get("name") for a in track.get("artists", [])],
                            "album": track.get("album", {}).get("name"),
                            "preview_url": track.get("preview_url"),
                            "external_urls": track.get("external_urls", {}),
                            "duration_ms": track.get("duration_ms"),
                            "popularity": track.get("popularity"),
                            "explicit": track.get("explicit", False),
                            "image_url": (track.get("album", {}).get("images", [{}])[0].get("url") if track.get("album", {}).get("images") else None),
                        })
                        
                        if len(all_tracks) >= limit:
                            break
            except Exception as search_error:
                logger.warning(f"Search failed for query '{query}': {search_error}")
                continue
        
        # 무작위로 섞고 요청된 개수만큼 반환
        random.shuffle(all_tracks)
        final_tracks = all_tracks[:limit]
        
        # 부족한 경우를 대비한 폴백 검색
        if len(final_tracks) < limit:
            try:
                fallback_results = sp.search(q="popular music", type="track", limit=limit * 2)
                for track in fallback_results["tracks"]["items"]:
                    if len(final_tracks) >= limit:
                        break
                    if track.get("id") and track["id"] not in used_track_ids:
                        final_tracks.append({
                            "id": track.get("id"),
                            "name": track.get("name"),
                            "artists": [a.get("name") for a in track.get("artists", [])],
                            "album": track.get("album", {}).get("name"),
                            "preview_url": track.get("preview_url"),
                            "external_urls": track.get("external_urls", {}),
                            "duration_ms": track.get("duration_ms"),
                            "popularity": track.get("popularity"),
                            "explicit": track.get("explicit", False),
                            "image_url": (track.get("album", {}).get("images", [{}])[0].get("url") if track.get("album", {}).get("images") else None),
                        })
            except Exception as fallback_error:
                logger.warning(f"Fallback search failed: {fallback_error}")
        
        return {
            "tracks": final_tracks,
            "total": len(final_tracks),
            "seeds": {"genres": seed_genres or [], "queries": search_queries[:5]},
            "parameters": {
                "total_queries": len(search_queries),
                "limit": limit,
                "target_valence": target_valence,
                "target_energy": target_energy,
                "target_danceability": target_danceability,
                "target_acousticness": target_acousticness
            },
        }
    except Exception as e:
        logger.error(f"Unexpected error in get_recommendations: {e}")
        raise ValueError(f"Failed to get recommendations: {e}")

def search_tracks(query: str, limit: int = 20) -> Dict[str, Any]:
    """
    트랙 검색
    """
    try:
        sp = get_spotify()
        results = sp.search(q=query, type="track", limit=min(limit, 50))
        
        tracks = []
        for track in results["tracks"]["items"]:
            track_info = {
                "id": track["id"],
                "name": track["name"],
                "artists": [artist["name"] for artist in track["artists"]],
                "album": track["album"]["name"],
                "preview_url": track.get("preview_url"),
                "external_urls": track.get("external_urls", {}),
                "popularity": track.get("popularity"),
                "image_url": track["album"]["images"][0]["url"] if track["album"]["images"] else None
            }
            tracks.append(track_info)
            
        return {
            "tracks": tracks,
            "total": results["tracks"]["total"],
            "limit": limit,
            "query": query
        }
        
    except SpotifyException as e:
        logger.error(f"Spotify search error: {e}")
        raise ValueError(f"Search failed: {e}")
    except Exception as e:
        logger.error(f"Unexpected search error: {e}")
        raise ValueError(f"Search failed: {e}")

def get_audio_features(track_ids: List[str]) -> Dict[str, Any]:
    """
    트랙의 오디오 특성 정보 가져오기
    """
    try:
        sp = get_spotify()
        features = sp.audio_features(track_ids)
        return {"audio_features": features}
    except SpotifyException as e:
        logger.error(f"Failed to get audio features: {e}")
        raise ValueError(f"Audio features request failed: {e}")

def get_available_genres() -> List[str]:
    """사용 가능한 장르 리스트 반환 (Client Credentials 토큰 자동 갱신 포함)"""
    try:
        token = _ensure_app_token()
        headers = {"Authorization": f"Bearer {token}"}
        url = "https://api.spotify.com/v1/recommendations/available-genre-seeds"
        res = requests.get(url, headers=headers, timeout=15)
        if res.status_code == 401:
            token = _ensure_app_token()
            headers = {"Authorization": f"Bearer {token}"}
            res = requests.get(url, headers=headers, timeout=15)
        if res.status_code != 200:
            raise ValueError(f"Genre seeds failed: {res.status_code} {res.text}")
        return res.json().get("genres", [])
    except Exception as e:
        logger.error(f"Failed to get available genres: {e}")
        raise ValueError(f"Genre list request failed: {e}")
