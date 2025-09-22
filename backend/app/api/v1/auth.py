from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.db import crud
from app.schemas.auth import UserCreate, UserLogin, UserResponse, Token, PasswordChange
import secrets

router = APIRouter()

def generate_token() -> str:
    """Generate a simple token for demonstration"""
    return secrets.token_urlsafe(32)

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """사용자 회원가입"""
    try:
        # 중복 사용자명 확인
        existing_user = crud.get_user_by_username(db, user_data.username)
        if existing_user:
            raise HTTPException(
                status_code=400, 
                detail="이미 존재하는 사용자명입니다."
            )
        
        # 사용자 생성
        user = crud.create_user(db, user_data)
        return UserResponse(id=user.id, username=user.username)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"회원가입 중 오류가 발생했습니다: {str(e)}")

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """사용자 로그인"""
    try:
        # 사용자 인증
        user = crud.authenticate_user(db, login_data.username, login_data.password)
        if not user:
            raise HTTPException(
                status_code=401, 
                detail="사용자명 또는 비밀번호가 잘못되었습니다."
            )
        
        # 토큰 생성
        token = generate_token()
        
        return Token(
            access_token=token,
            token_type="bearer",
            user=UserResponse(id=user.id, username=user.username)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"로그인 중 오류가 발생했습니다: {str(e)}")

@router.get("/users/{username}", response_model=UserResponse)
async def get_user_info(username: str, db: Session = Depends(get_db)):
    """사용자 정보 조회"""
    user = crud.get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    return UserResponse(id=user.id, username=user.username)

@router.post("/change-password")
async def change_password(password_data: PasswordChange, db: Session = Depends(get_db)):
    """비밀번호 변경"""
    try:
        # 비밀번호 변경 시도
        success = crud.change_password(
            db, 
            password_data.username,
            password_data.current_password,
            password_data.new_password
        )
        
        if not success:
            raise HTTPException(
                status_code=400, 
                detail="현재 비밀번호가 올바르지 않거나 사용자를 찾을 수 없습니다."
            )
        
        return {"message": "비밀번호가 성공적으로 변경되었습니다."}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"비밀번호 변경 중 오류가 발생했습니다: {str(e)}")
