from pydantic import BaseModel
from typing import List, Tuple, Optional

class AnalyzeRequest(BaseModel):
    text: str
    threshold: Optional[float] = None
    topk: Optional[int] = None

class EmotionPrediction(BaseModel):
    label: str
    probability: float

class AnalyzeResponse(BaseModel):
    predictions: List[EmotionPrediction]
    all_probabilities: List[float]
