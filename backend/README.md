# Emotion Music App - Backend

FastAPI 기반의 감정 분석 음악 추천 백엔드 API입니다.

## 설치 및 실행

### 1. 환경 설정

```bash
# 가상환경 생성 (선택)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정
copy env.example .env
# .env 파일을 편집하여 Spotify API 키 설정
```

### 2. 데이터베이스 초기화

```bash
# 자동으로 SQLite 데이터베이스가 생성됩니다
# 또는 PostgreSQL 사용 시 DATABASE_URL 변경
```

### 3. 서버 실행

```bash
uvicorn app.main:app --reload --port 8000
```

## API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 주요 모듈

### Core (`app/core/`)
- `config.py`: 환경 설정 관리

### NLP (`app/nlp/`)
- `labels.py`: GoEmotions 라벨 정의
- `tokenizer.py`: BERT 토크나이저

### Model (`app/model/`)
- `emotion_model.py`: 감정 분석 모델
- `train.py`: 모델 학습 (오프라인)

### Recommend (`app/recommend/`)
- `emotion_map.py`: 감정-음악 특성 매핑
- `recommender.py`: 추천 로직

### Services (`app/services/`)
- `spotify.py`: Spotify API 클라이언트

### Database (`app/db/`)
- `base.py`: SQLAlchemy 설정
- `models.py`: 데이터베이스 모델
- `crud.py`: CRUD 함수

### API (`app/api/v1/`)
- `analyze.py`: 감정 분석 엔드포인트
- `recommend.py`: 음악 추천 엔드포인트
- `diaries.py`: 일기 관리 엔드포인트

## 환경 변수

`.env` 파일에 다음 설정이 필요합니다:

```env
# 필수: Spotify API 인증
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# 선택: 데이터베이스 (기본값: SQLite)
DATABASE_URL=sqlite:///./emotion_app.db

# 선택: 모델 설정
MODEL_DIR=./models/goemotions_bert
THRESHOLD=0.30
TOPK=3
```

## Spotify API 설정

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)에 접속
2. 새 앱 생성
3. Client ID와 Client Secret 복사
4. `.env` 파일에 추가

## 개발

### 새로운 API 엔드포인트 추가

1. `app/schemas/`에 Pydantic 스키마 정의
2. `app/api/v1/`에 라우터 생성
3. `app/main.py`에 라우터 등록

### 데이터베이스 모델 변경

1. `app/db/models.py` 수정
2. 서버 재시작으로 자동 마이그레이션 (SQLite)
3. PostgreSQL 사용 시 Alembic 설정 필요

### 감정 분석 모델 교체

1. `models/` 디렉토리에 새 모델 배치
2. `MODEL_DIR` 환경 변수 업데이트
3. 필요시 `app/model/emotion_model.py` 수정
