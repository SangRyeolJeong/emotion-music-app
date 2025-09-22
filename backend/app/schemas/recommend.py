from pydantic import BaseModel
from typing import List, Dict, Tuple, Optional, Any

class EmotionInput(BaseModel):
    label: str
    probability: float

class RecommendRequest(BaseModel):
    selected: List[EmotionInput]
    limit: int = 4

class TrackInfo(BaseModel):
    id: str
    name: str
    artists: List[str]  # 아티스트는 리스트로 변경
    album: str
    preview_url: Optional[str] = None
    external_urls: Dict[str, str] = {}
    image_url: Optional[str] = None
    duration_ms: Optional[int] = None
    popularity: int = 0
    explicit: bool = False

class RecommendResponse(BaseModel):
    target: Dict[str, float]
    seeds: Dict[str, Any]  # seeds는 딕셔너리로 변경
    tracks: List[TrackInfo]
    total: int = 0
    spotify_params: Optional[Dict[str, Any]] = None
