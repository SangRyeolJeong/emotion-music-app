from fastapi import APIRouter, HTTPException
from app.model.emotion_model import predict
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse, EmotionPrediction

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_emotion(request: AnalyzeRequest):
    """
    Analyze emotions in text using GoEmotions BERT model
    """
    try:
        selected, all_probs = predict(request.text, request.threshold, request.topk)
        
        predictions = [
            EmotionPrediction(label=label, probability=prob) 
            for label, prob in selected
        ]
        
        return AnalyzeResponse(
            predictions=predictions,
            all_probabilities=all_probs
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing emotions: {str(e)}")
