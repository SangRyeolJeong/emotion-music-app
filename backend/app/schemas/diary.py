from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import date

class DiaryCreate(BaseModel):
    content: str  # 새 모델에서는 content 필드 사용
    emotion: Optional[str] = None
    music: Optional[Dict[str, Any]] = None
    date: Optional[str] = None  # 날짜를 문자열로 받아서 처리

class DiaryResponse(BaseModel):
    id: int
    user_id: int
    date: date
    content: str
    emotion: Optional[str]
    music: Optional[Dict[str, Any]]
    
    class Config:
        from_attributes = True
