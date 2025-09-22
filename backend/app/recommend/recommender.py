from typing import List, Tuple, Dict
import numpy as np
from app.recommend.emotion_map import EMOTION_TO_SPOTIFY
from app.services.spotify import get_spotify

def aggregate_targets(selected: List[Tuple[str, float]]) -> Tuple[Dict, List[str]]:
    """
    Aggregate emotion predictions into target audio features and seeds
    """
    vals, enes, dans, weights = [], [], [], []
    seeds_pool: List[str] = []

    for label, prob in selected:
        if label not in EMOTION_TO_SPOTIFY:
            continue
        
        emotion_data = EMOTION_TO_SPOTIFY[label]
        v_low, v_high = emotion_data["valence"]
        e_low, e_high = emotion_data["energy"]
        d_low, d_high = emotion_data["danceability"]

        vals.append((v_low + v_high) / 2)
        enes.append((e_low + e_high) / 2)
        dans.append((d_low + d_high) / 2)
        weights.append(prob)
        seeds_pool.extend(emotion_data["seeds"])

    if not vals:
        # Fallback if no emotions found
        return {
            "valence": 0.5, 
            "energy": 0.5, 
            "danceability": 0.5
        }, ["pop", "indie-pop", "edm"]

    # Weighted average
    w = np.array(weights, dtype=np.float32)
    w = w / (w.sum() + 1e-8)

    target = {
        "valence": float(np.dot(vals, w)),
        "energy": float(np.dot(enes, w)),
        "danceability": float(np.dot(dans, w)),
    }

    # Remove duplicates while preserving order
    unique_seeds = []
    for seed in seeds_pool:
        if seed not in unique_seeds:
            unique_seeds.append(seed)
    
    # Ensure we have at least 3 seeds, max 5 for Spotify API
    seeds = unique_seeds[:5] if len(unique_seeds) >= 3 else (unique_seeds + ["pop", "indie-pop", "edm"])[:3]
    return target, seeds

def recommend_tracks(target: Dict, seeds: List[str], limit: int = 12) -> List[Dict]:
    """
    Get music recommendations from Spotify based on target features and seeds
    """
    try:
        sp = get_spotify()
        
        # Spotify recommendations: seed_genres max 5
        params = {
            "seed_genres": seeds[:5],
            "limit": min(limit, 100),  # Spotify API limit
            "target_valence": target["valence"],
            "target_energy": target["energy"],
            "target_danceability": target["danceability"]
        }
        
        res = sp.recommendations(**params)
        items = []
        
        for track in res.get("tracks", []):
            items.append({
                "id": track["id"],
                "name": track["name"],
                "artists": ", ".join(artist["name"] for artist in track["artists"]),
                "preview_url": track.get("preview_url"),
                "external_url": track["external_urls"]["spotify"],
                "album_image": (
                    track["album"]["images"][0]["url"] 
                    if track["album"]["images"] 
                    else None
                ),
                "duration_ms": track.get("duration_ms", 0),
                "popularity": track.get("popularity", 0)
            })
        
        return items
    
    except Exception as e:
        print(f"Error getting Spotify recommendations: {e}")
        # Return empty list on error
        return []
