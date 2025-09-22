from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    
    class Config:
        from_attributes = True

class PasswordChange(BaseModel):
    username: str
    current_password: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
