from sqlalchemy.orm import Session
from app.db import models
from app.schemas.auth import UserCreate
from typing import List, Dict, Optional
import hashlib

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed_password

def create_user(db: Session, user_data: UserCreate) -> models.User:
    """Create a new user"""
    hashed_password = hash_password(user_data.password)
    db_user = models.User(
        username=user_data.username, 
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    """Get user by username"""
    return db.query(models.User).filter(models.User.username == username).first()

def get_user(db: Session, user_id: int) -> Optional[models.User]:
    """Get user by ID"""
    return db.query(models.User).filter(models.User.id == user_id).first()

def authenticate_user(db: Session, username: str, password: str) -> Optional[models.User]:
    """Authenticate user with username and password"""
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

def change_password(db: Session, username: str, current_password: str, new_password: str) -> bool:
    """Change user password"""
    user = get_user_by_username(db, username)
    if not user:
        return False
    
    # 현재 비밀번호 확인
    if not verify_password(current_password, user.password):
        return False
    
    # 새 비밀번호로 업데이트
    user.password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return True

def create_diary(db: Session, user_id: int, content: str, emotion: str = None, music: Dict = None, date_str: str = None) -> models.Diary:
    """Create a new diary entry"""
    from datetime import datetime, date
    
    # 날짜 처리
    if date_str:
        try:
            entry_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            entry_date = date.today()
    else:
        entry_date = date.today()
    
    db_diary = models.Diary(
        user_id=user_id, 
        content=content,
        emotion=emotion,
        music=music,
        date=entry_date
    )
    db.add(db_diary)
    db.commit()
    db.refresh(db_diary)
    return db_diary

def get_diary_by_user_and_date(db: Session, user_id: int, date_str: str) -> Optional[models.Diary]:
    """Get a diary for a user on a specific date (YYYY-MM-DD)."""
    from datetime import datetime
    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return None
    return (
        db.query(models.Diary)
        .filter(models.Diary.user_id == user_id, models.Diary.date == target_date)
        .first()
    )

def upsert_diary(db: Session, user_id: int, content: str, emotion: str = None, music: Dict = None, date_str: str = None) -> models.Diary:
    """Create or update a diary entry for the given user and date."""
    from datetime import datetime, date

    # Resolve date
    if date_str:
        try:
            entry_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            entry_date = date.today()
    else:
        entry_date = date.today()

    existing = (
        db.query(models.Diary)
        .filter(models.Diary.user_id == user_id, models.Diary.date == entry_date)
        .first()
    )

    if existing:
        existing.content = content
        existing.emotion = emotion
        existing.music = music
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing

    db_diary = models.Diary(
        user_id=user_id,
        content=content,
        emotion=emotion,
        music=music,
        date=entry_date,
    )
    db.add(db_diary)
    db.commit()
    db.refresh(db_diary)
    return db_diary

def get_diary(db: Session, diary_id: int) -> Optional[models.Diary]:
    """Get diary by ID"""
    return db.query(models.Diary).filter(models.Diary.id == diary_id).first()

def get_diaries(db: Session, user_id: int, limit: int = 30) -> List[models.Diary]:
    """Get user's diaries"""
    return (db.query(models.Diary)
            .filter(models.Diary.user_id == user_id)
            .order_by(models.Diary.date.desc())
            .limit(limit)
            .all())

# Recommendation functions removed - recommendations are now stored in diary.music field
