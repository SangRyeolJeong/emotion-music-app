EMOTION_TO_SPOTIFY = {
    "admiration": {
        "valence": (0.60, 0.85), 
        "energy": (0.40, 0.65), 
        "danceability": (0.45, 0.70),
        "seeds": ["classical", "jazz", "singer-songwriter", "acoustic"]
    },
    "amusement": {
        "valence": (0.70, 0.90), 
        "energy": (0.50, 0.75), 
        "danceability": (0.60, 0.85),
        "seeds": ["pop", "indie-pop", "k-pop", "funk"]
    },
    "anger": {
        "valence": (0.05, 0.25), 
        "energy": (0.70, 0.95), 
        "danceability": (0.40, 0.65),
        "seeds": ["metal", "hard-rock", "punk", "industrial"]
    },
    "annoyance": {
        "valence": (0.10, 0.30), 
        "energy": (0.50, 0.75), 
        "danceability": (0.30, 0.55),
        "seeds": ["alternative", "grunge", "punk-rock", "heavy-metal"]
    },
    "approval": {
        "valence": (0.65, 0.80), 
        "energy": (0.45, 0.70), 
        "danceability": (0.50, 0.75),
        "seeds": ["pop", "indie", "folk", "acoustic"]
    },
    "caring": {
        "valence": (0.55, 0.75), 
        "energy": (0.30, 0.55), 
        "danceability": (0.35, 0.60),
        "seeds": ["folk", "acoustic", "singer-songwriter", "indie"]
    },
    "confusion": {
        "valence": (0.30, 0.50), 
        "energy": (0.35, 0.60), 
        "danceability": (0.30, 0.55),
        "seeds": ["experimental", "ambient", "electronic", "indie"]
    },
    "curiosity": {
        "valence": (0.50, 0.70), 
        "energy": (0.40, 0.65), 
        "danceability": (0.45, 0.70),
        "seeds": ["indie", "experimental", "electronic", "world-music"]
    },
    "desire": {
        "valence": (0.60, 0.85), 
        "energy": (0.50, 0.75), 
        "danceability": (0.55, 0.80),
        "seeds": ["r-n-b", "soul", "funk", "dance"]
    },
    "disappointment": {
        "valence": (0.15, 0.35), 
        "energy": (0.20, 0.45), 
        "danceability": (0.25, 0.50),
        "seeds": ["blues", "sad", "acoustic", "indie"]
    },
    "disapproval": {
        "valence": (0.10, 0.30), 
        "energy": (0.40, 0.65), 
        "danceability": (0.25, 0.50),
        "seeds": ["alternative", "punk", "grunge", "indie-rock"]
    },
    "disgust": {
        "valence": (0.05, 0.25), 
        "energy": (0.60, 0.85), 
        "danceability": (0.20, 0.45),
        "seeds": ["metal", "industrial", "punk", "hardcore"]
    },
    "embarrassment": {
        "valence": (0.20, 0.40), 
        "energy": (0.25, 0.50), 
        "danceability": (0.20, 0.45),
        "seeds": ["indie", "acoustic", "folk", "chill"]
    },
    "excitement": {
        "valence": (0.75, 0.95), 
        "energy": (0.70, 0.95), 
        "danceability": (0.70, 0.95),
        "seeds": ["pop", "dance", "electronic", "upbeat"]
    },
    "fear": {
        "valence": (0.10, 0.30), 
        "energy": (0.40, 0.70), 
        "danceability": (0.15, 0.40),
        "seeds": ["dark-ambient", "industrial", "metal", "experimental"]
    },
    "gratitude": {
        "valence": (0.70, 0.90), 
        "energy": (0.40, 0.65), 
        "danceability": (0.45, 0.70),
        "seeds": ["gospel", "soul", "folk", "acoustic"]
    },
    "grief": {
        "valence": (0.05, 0.25), 
        "energy": (0.15, 0.40), 
        "danceability": (0.10, 0.35),
        "seeds": ["sad", "blues", "classical", "ambient"]
    },
    "joy": {
        "valence": (0.80, 0.95), 
        "energy": (0.60, 0.85), 
        "danceability": (0.70, 0.90),
        "seeds": ["pop", "dance", "funk", "happy"]
    },
    "love": {
        "valence": (0.75, 0.90), 
        "energy": (0.45, 0.70), 
        "danceability": (0.50, 0.75),
        "seeds": ["r-n-b", "soul", "romantic", "pop"]
    },
    "nervousness": {
        "valence": (0.25, 0.45), 
        "energy": (0.50, 0.75), 
        "danceability": (0.30, 0.55),
        "seeds": ["indie", "alternative", "electronic", "experimental"]
    },
    "optimism": {
        "valence": (0.70, 0.90), 
        "energy": (0.55, 0.80), 
        "danceability": (0.60, 0.85),
        "seeds": ["pop", "indie-pop", "upbeat", "happy"]
    },
    "pride": {
        "valence": (0.65, 0.85), 
        "energy": (0.50, 0.75), 
        "danceability": (0.55, 0.80),
        "seeds": ["pop", "rock", "anthemic", "uplifting"]
    },
    "realization": {
        "valence": (0.45, 0.65), 
        "energy": (0.35, 0.60), 
        "danceability": (0.40, 0.65),
        "seeds": ["indie", "folk", "acoustic", "contemplative"]
    },
    "relief": {
        "valence": (0.55, 0.75), 
        "energy": (0.30, 0.55), 
        "danceability": (0.35, 0.60),
        "seeds": ["chill", "ambient", "folk", "acoustic"]
    },
    "remorse": {
        "valence": (0.10, 0.30), 
        "energy": (0.20, 0.45), 
        "danceability": (0.15, 0.40),
        "seeds": ["sad", "blues", "folk", "acoustic"]
    },
    "sadness": {
        "valence": (0.05, 0.25), 
        "energy": (0.15, 0.40), 
        "danceability": (0.10, 0.35),
        "seeds": ["sad", "blues", "indie", "acoustic"]
    },
    "surprise": {
        "valence": (0.50, 0.70), 
        "energy": (0.55, 0.80), 
        "danceability": (0.50, 0.75),
        "seeds": ["experimental", "electronic", "indie", "alternative"]
    },
    "neutral": {
        "valence": (0.45, 0.55), 
        "energy": (0.40, 0.60), 
        "danceability": (0.45, 0.65),
        "seeds": ["indie", "study", "chill", "soft-rock"]
    }
}
