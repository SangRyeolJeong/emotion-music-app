"""
Translation service for Korean-English text processing
"""
from deep_translator import GoogleTranslator
from langdetect import detect, LangDetectException
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        self._cache = {}  # Simple in-memory cache
    
    def detect_language(self, text: str) -> str:
        """Detect language, return 'ko' or 'en' or 'unknown'"""
        try:
            detected = detect(text)
            return detected
        except LangDetectException:
            return 'unknown'
    
    def translate_to_english(self, text: str) -> Tuple[str, str, bool]:
        """
        Returns (translated_text, detected_language, was_translated)
        """
        # Cache key
        cache_key = hash(text.strip())
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        try:
            detected_lang = self.detect_language(text)
            
            # If already English or unknown, return as-is
            if detected_lang in ['en', 'unknown']:
                result = (text, detected_lang, False)
                self._cache[cache_key] = result
                return result
            
            # Translate Korean to English
            if detected_lang == 'ko':
                translator = GoogleTranslator(source='ko', target='en')
                translated_text = translator.translate(text)
                result = (translated_text, detected_lang, True)
                self._cache[cache_key] = result
                logger.info(f"Translated KO->EN: {text[:30]}... -> {translated_text[:30]}...")
                return result
            
            # Other languages - translate to English anyway
            translator = GoogleTranslator(source='auto', target='en')
            translated_text = translator.translate(text)
            result = (translated_text, detected_lang, True)
            self._cache[cache_key] = result
            return result
            
        except Exception as e:
            logger.error(f"Translation failed: {e}")
            # Fallback: return original text
            result = (text, 'unknown', False)
            self._cache[cache_key] = result
            return result

# Global instance
translation_service = TranslationService()

def translate_if_needed(text: str) -> Tuple[str, str, bool]:
    """
    Convenience function
    Returns: (translated_text, detected_language, was_translated)
    """
    return translation_service.translate_to_english(text)
