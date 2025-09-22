from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.base import get_db
from app.db import crud
from app.schemas.diary import DiaryCreate, DiaryResponse

router = APIRouter()

# User endpoints removed - now handled by auth.py

@router.post("/diaries", response_model=DiaryResponse)
async def create_or_update_diary(
    diary: DiaryCreate, 
    user_id: int,  # Required user_id parameter
    db: Session = Depends(get_db)
):
    """Create or update a diary entry for the given date"""
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.upsert_diary(
        db=db, 
        user_id=user_id, 
        content=diary.content,
        emotion=diary.emotion,
        music=diary.music,
        date_str=diary.date
    )

@router.get("/diaries", response_model=List[DiaryResponse])
async def get_diaries(
    user_id: int,  # Required user_id parameter
    limit: int = 30, 
    db: Session = Depends(get_db)
):
    """Get user's diary entries"""
    # Verify user exists
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return crud.get_diaries(db, user_id=user_id, limit=limit)

@router.get("/diaries/{diary_id}", response_model=DiaryResponse)
async def get_diary(diary_id: int, db: Session = Depends(get_db)):
    """Get specific diary entry"""
    db_diary = crud.get_diary(db, diary_id=diary_id)
    if db_diary is None:
        raise HTTPException(status_code=404, detail="Diary not found")
    return db_diary
