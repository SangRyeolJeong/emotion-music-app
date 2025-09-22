# Emotion Music App

감정 분석 기반 음악 추천 애플리케이션입니다. 사용자의 일기를 분석하여 감정을 파악하고, 해당 감정에 맞는 음악을 추천합니다.

## 프로젝트 구조

```
emotion-music-app/
├── backend/                 # FastAPI 백엔드
│   ├── app/
│   │   ├── api/v1/         # API 라우트
│   │   ├── core/           # 설정 및 공통 모듈
│   │   ├── nlp/            # 자연어 처리
│   │   ├── model/          # AI 모델
│   │   ├── recommend/      # 음악 추천 로직
│   │   ├── services/       # 외부 서비스 (Spotify)
│   │   ├── db/             # 데이터베이스
│   │   └── schemas/        # Pydantic 스키마
│   └── requirements.txt
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── pages/          # 메인 페이지
│   │   ├── components/     # UI 컴포넌트
│   │   ├── api/            # API 클라이언트
│   │   └── store/          # 상태 관리
│   └── package.json
└── models/                  # AI 모델 저장소
```

## 주요 기능

- 📝 **일기 작성**: 자유로운 텍스트로 감정 표현
- 🧠 **감정 분석**: GoEmotions BERT 모델을 사용한 다중 감정 분류
- 🎵 **음악 추천**: 감정 기반 Spotify 음악 추천
- 📊 **시각화**: 감정 히스토리와 통계 차트
- 💾 **데이터 저장**: 일기, 감정, 추천 음악 이력 저장

## 설치 및 실행

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd emotion-music-app

# 환경 변수 설정
cp backend/env.example backend/.env
# .env 파일에서 Spotify API 키 설정
```

### 2. 백엔드 실행

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

### 4. 접속

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## 환경 변수

backend/.env 파일에 다음 설정이 필요합니다:

```env
# Spotify API (필수)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret

# 데이터베이스 (선택, 기본값: SQLite)
DATABASE_URL=sqlite:///./emotion_app.db

# 모델 설정
MODEL_DIR=./models/goemotions_bert
THRESHOLD=0.30
TOPK=3
```

## API 엔드포인트

### 감정 분석
- `POST /api/v1/analyze` - 텍스트 감정 분석

### 음악 추천  
- `POST /api/v1/recommend` - 감정 기반 음악 추천

### 일기 관리
- `POST /api/v1/diaries` - 일기 작성
- `GET /api/v1/diaries` - 일기 목록 조회

## 기술 스택

### 백엔드
- **FastAPI** - 웹 프레임워크
- **SQLAlchemy** - ORM
- **Transformers** - BERT 모델
- **Spotipy** - Spotify API 클라이언트
- **PyTorch** - 딥러닝 프레임워크

### 프론트엔드
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Material-UI** - UI 컴포넌트
- **Zustand** - 상태 관리
- **Recharts** - 차트 라이브러리
- **Vite** - 빌드 도구

### AI/ML
- **GoEmotions BERT** - 감정 분류 모델
- **Spotify Web API** - 음악 데이터

## 개발 로드맵

- [x] 백엔드 API 구조 설계
- [x] 감정 분석 모델 통합
- [x] Spotify 추천 시스템
- [x] React 프론트엔드 구현
- [x] 데이터베이스 설계
- [ ] 사용자 인증 시스템
- [ ] 모델 파인튜닝
- [ ] 배포 자동화
- [ ] 실시간 알림

## 라이센스

MIT License
