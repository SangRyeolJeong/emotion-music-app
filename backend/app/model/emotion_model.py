import torch
import numpy as np
from transformers import BertTokenizer, BertForSequenceClassification
from app.core.config import settings
from app.nlp.labels import GOEMOTIONS_LABELS
from typing import List, Tuple

_model = None
_tokenizer = None
_device = "cuda" if torch.cuda.is_available() else "cpu"

def load_model():
    global _model, _tokenizer
    if _model is None:
        try:
            # Try to load custom trained model first
            _model = BertForSequenceClassification.from_pretrained(
                settings.MODEL_DIR, 
                num_labels=len(GOEMOTIONS_LABELS),
                problem_type="multi_label_classification",
            ).to(_device)
            _tokenizer = BertTokenizer.from_pretrained(settings.MODEL_DIR)
        except Exception:
            # Fallback to pre-trained GoEmotions model from HuggingFace
            print("Loading pre-trained GoEmotions model...")
            _model = BertForSequenceClassification.from_pretrained(
                "monologg/bert-base-cased-goemotions-original",
                num_labels=len(GOEMOTIONS_LABELS),
                problem_type="multi_label_classification",
            ).to(_device)
            _tokenizer = BertTokenizer.from_pretrained("monologg/bert-base-cased-goemotions-original")
        _model.eval()
    return _model, _tokenizer

def predict(text: str, threshold: float = None, topk: int = None) -> Tuple[List[Tuple[str, float]], List[float]]:
    """원래 코드 로직을 사용한 감정 예측"""
    threshold = settings.THRESHOLD if threshold is None else threshold
    topk = settings.TOPK if topk is None else topk

    model, tokenizer = load_model()

    # 원래 코드의 토크나이징 방식 사용
    inputs = tokenizer(
        text,
        return_tensors="pt",
        padding="max_length",
        truncation=True,
        max_length=settings.MAX_LEN,
    ).to(_device)

    model.eval()
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs_tensor = torch.sigmoid(logits)
        probs = probs_tensor.detach().cpu().numpy()[0]

    # 원래 코드의 선택 로직
    if topk is not None:
        idxs = probs.argsort()[::-1][:topk]
    else:
        idxs = np.where(probs >= threshold)[0]
        if len(idxs) == 0:
            idxs = [int(probs.argmax())]

    selected = [(GOEMOTIONS_LABELS[i], float(probs[i])) for i in idxs]
    # Sort by confidence for consistency
    selected.sort(key=lambda x: x[1], reverse=True)
    return selected, probs.tolist()
