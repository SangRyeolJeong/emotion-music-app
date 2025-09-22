from transformers import BertTokenizer
from app.core.config import settings

_tokenizer = None

def get_tokenizer():
    global _tokenizer
    if _tokenizer is None:
        try:
            _tokenizer = BertTokenizer.from_pretrained(settings.MODEL_DIR)
        except Exception:
            # Fallback to base model if custom model not found
            _tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    return _tokenizer
