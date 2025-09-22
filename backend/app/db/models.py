from sqlalchemy import Column, Integer, String, ForeignKey, Date, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    diaries = relationship('Diary', back_populates='owner')

class Diary(Base):
    __tablename__ = 'diaries'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(Date, nullable=False)
    content = Column(String, nullable=False)
    emotion = Column(String)
    music = Column(JSON)  # 추천된 음악 정보를 JSON 형태로 저장
    owner = relationship('User', back_populates='diaries')
