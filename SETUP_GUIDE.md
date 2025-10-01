# Emotion Music App - 완전한 설치 및 실행 가이드

이 가이드는 다른 컴퓨터에서 Emotion Music App을 처음부터 설치하고 실행하는 방법을 설명합니다.

## 📋 시스템 요구사항

### 필수 소프트웨어
- **Python 3.8 이상** (권장: Python 3.11)
- **Node.js 16 이상** (권장: Node.js 18+)
- **npm** (Node.js와 함께 설치됨)
- **Git** (프로젝트 클론용)

### 운영체제
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+)

## 🚀 설치 단계별 가이드

### 1단계: 프로젝트 클론 및 기본 설정

```bash
# 프로젝트 클론
git clone <repository-url>
cd emotion-music-app

# 또는 ZIP 파일로 다운로드한 경우
# 압축 해제 후 해당 폴더로 이동
```

### 2단계: 백엔드 설정

#### 2.1 Python 가상환경 생성 (권장)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 2.2 백엔드 의존성 설치
```bash
cd backend

# 완전한 패키지 설치
pip install -r requirements_complete.txt

# 또는 기존 requirements.txt 사용
pip install -r requirements.txt
```

#### 2.3 환경 변수 설정
```bash
# .env 파일 생성
cp env.example .env

# .env 파일 편집 (필수!)
# 텍스트 에디터로 .env 파일을 열고 다음 값들을 설정:
```

**.env 파일 내용 (필수 설정):**
```env
# Spotify API 설정 (필수!)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# 데이터베이스 설정
DATABASE_URL=sqlite:///./emotion_app.db

# 모델 설정
MODEL_DIR=./models/goemotions_bert
MAX_LEN=256
THRESHOLD=0.30
TOPK=3

# 앱 설정
APP_NAME=Emotion Music App
DEBUG=true
```

#### 2.4 Spotify API 키 발급 방법
1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) 접속
2. 로그인 후 "Create App" 클릭
3. 앱 이름과 설명 입력
4. Redirect URI: `http://localhost:8000/api/v1/spotify/callback` 입력
5. Client ID와 Client Secret을 .env 파일에 복사

#### 2.5 데이터베이스 초기화
```bash
# 데이터베이스 테이블 생성
python init_db.py
```

### 3단계: 프론트엔드 설정

```bash
# 프론트엔드 폴더로 이동
cd ../frontend

# Node.js 의존성 설치
npm install
```

### 4단계: 실행

#### 방법 1: 자동 실행 스크립트 사용 (Windows)
```powershell
# 프로젝트 루트 폴더에서
.\start.ps1
```

#### 방법 2: 수동 실행

**터미널 1 - 백엔드 실행:**
```bash
cd backend

# 가상환경 활성화 (필요시)
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# 백엔드 서버 시작
uvicorn app.main:app --reload --port 8000
```

**터미널 2 - 프론트엔드 실행:**
```bash
cd frontend

# 프론트엔드 개발 서버 시작
npm run dev
```

## 🌐 접속 주소

설치가 완료되면 다음 주소로 접속할 수 있습니다:

- **프론트엔드**: http://localhost:3000 (또는 http://localhost:5173)
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 🔧 문제 해결

### 자주 발생하는 오류와 해결책

#### 1. Python 패키지 설치 오류
```bash
# pip 업그레이드
pip install --upgrade pip

# 개별 패키지 설치 시도
pip install torch transformers fastapi uvicorn
```

#### 2. Node.js 패키지 설치 오류
```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 3. Spotify API 연결 오류
- .env 파일의 SPOTIFY_CLIENT_ID와 SPOTIFY_CLIENT_SECRET 확인
- Spotify Developer Dashboard에서 앱 설정 확인
- Redirect URI가 정확한지 확인

#### 4. 데이터베이스 오류
```bash
# 데이터베이스 파일 삭제 후 재생성
rm emotion_app.db
python init_db.py
```

#### 5. 포트 충돌 오류
```bash
# 다른 포트 사용
# 백엔드
uvicorn app.main:app --reload --port 8001

# 프론트엔드 (vite.config.ts에서 포트 변경)
npm run dev -- --port 3001
```

## 📦 패키지 버전 정보

### 백엔드 주요 패키지
- FastAPI: 0.104.1
- PyTorch: 2.1.1
- Transformers: 4.35.2
- Spotipy: 2.23.0
- SQLAlchemy: 2.0.23

### 프론트엔드 주요 패키지
- React: 18.2.0
- TypeScript: 5.2.2
- Material-UI: 5.14.18
- Vite: 4.5.0

## 🔐 기본 로그인 정보

앱 실행 후 다음 계정으로 로그인할 수 있습니다:
- **사용자명**: aaaa
- **비밀번호**: 123456

## 📝 추가 설정 (선택사항)

### PostgreSQL 사용 (프로덕션 환경)
```env
# .env 파일에서 DATABASE_URL 변경
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/emotion_app
```

### CUDA GPU 사용 (AI 모델 가속)
```bash
# CUDA 지원 PyTorch 설치
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

## 🆘 도움이 필요한 경우

1. 모든 단계를 순서대로 따라했는지 확인
2. Python과 Node.js 버전이 요구사항을 만족하는지 확인
3. .env 파일의 Spotify API 키가 올바른지 확인
4. 방화벽이나 안티바이러스가 포트를 차단하지 않는지 확인

---

이 가이드를 따라하면 어떤 컴퓨터에서든 Emotion Music App을 성공적으로 실행할 수 있습니다! 🎉
