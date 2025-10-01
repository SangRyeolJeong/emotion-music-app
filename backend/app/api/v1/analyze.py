from fastapi import APIRouter, HTTPException
from app.model.emotion_model import predict
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse, EmotionPrediction
from app.services.translation import translate_if_needed
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_emotion(request: AnalyzeRequest):
    """
    Analyze emotions in text using GoEmotions BERT model
    Supports Korean text via automatic translation
    """
    try:
        original_text = request.text
        
        # Translation pipeline: detect language -> translate if needed
        analyzed_text, detected_lang, was_translated = translate_if_needed(original_text)
        
        if was_translated:
            logger.info(f"Translated {detected_lang} -> en for emotion analysis")
        
        # Emotion analysis on (possibly translated) English text
        selected, all_probs = predict(analyzed_text, request.threshold, request.topk)
        
        predictions = [
            EmotionPrediction(label=label, probability=prob) 
            for label, prob in selected
        ]
        
        return AnalyzeResponse(
            predictions=predictions,
            all_probabilities=all_probs,
            original_text=original_text,
            analyzed_text=analyzed_text,
            detected_language=detected_lang,
            was_translated=was_translated
        )
    
    except Exception as e:
        logger.error(f"Error in emotion analysis pipeline: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing emotions: {str(e)}")
