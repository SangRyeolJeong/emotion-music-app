# 🚀 GitHub에서 다운받아서 다른 컴퓨터에서 실행하기

이 가이드는 GitHub에서 Emotion Music App을 다운받아서 새로운 컴퓨터에서 처음부터 실행하는 방법을 설명합니다.

## 📋 사전 준비사항

### 필수 소프트웨어 설치
다음 소프트웨어들을 먼저 설치해야 합니다:

1. **Python 3.8 이상** (권장: 3.11)
   - [Python 공식 사이트](https://www.python.org/downloads/)에서 다운로드
   - 설치 시 "Add Python to PATH" 체크 필수

2. **Node.js 16 이상** (권장: 18+)
   - [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전 다운로드
   - npm이 자동으로 함께 설치됨

3. **Git** (선택사항, ZIP 다운로드 대신 사용)
   - [Git 공식 사이트](https://git-scm.com/downloads)에서 다운로드

## 🔽 프로젝트 다운로드

### 방법 1: Git Clone (권장)
```bash
git clone https://github.com/SangRyeolJeong/emotion-music-app.git
cd emotion-music-app
```

### 방법 2: ZIP 다운로드
1. GitHub 페이지에서 "Code" → "Download ZIP" 클릭
2. 다운받은 ZIP 파일을 원하는 위치에 압축 해제
3. 압축 해제된 폴더로 이동

## ⚡ 빠른 설치 (Windows)

Windows 사용자는 자동 설치 스크립트를 사용할 수 있습니다:

```powershell
# PowerShell을 관리자 권한으로 실행
# 프로젝트 폴더에서 실행
.\setup.ps1
```

자동 설치가 완료되면 [5단계: Spotify API 설정](#5단계-spotify-api-설정)으로 이동하세요.

## 🔧 수동 설치 (모든 운영체제)

### 1단계: Python 가상환경 설정

```bash
# 프로젝트 폴더에서 실행
cd backend

# 가상환경 생성
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate
```

### 2단계: Python 패키지 설치

```bash
# pip 업그레이드
pip install --upgrade pip

# 필요한 패키지 설치
pip install -r requirements.txt
```

**만약 설치 중 오류가 발생하면:**
```bash
# 개별 패키지 설치 시도
pip install fastapi uvicorn torch transformers spotipy sqlalchemy pydantic python-dotenv deep-translator langdetect
```

### 3단계: 환경 변수 설정

```bash
# .env 파일 생성
cp env.example .env

# Windows에서는:
copy env.example .env
```

### 4단계: 데이터베이스 초기화

```bash
# 여전히 backend 폴더에서 실행
python init_db.py
```

### 5단계: Spotify API 설정

**중요: 이 단계는 필수입니다!**

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) 접속
2. Spotify 계정으로 로그인
3. "Create App" 클릭
4. 앱 정보 입력:
   - App name: `Emotion Music App` (또는 원하는 이름)
   - App description: `Emotion-based music recommendation`
   - Redirect URI: `http://localhost:8000/api/v1/spotify/callback`
   - API/SDKs: Web API 체크
5. 생성된 앱에서 Client ID와 Client Secret 복사
6. `backend/.env` 파일을 텍스트 에디터로 열고 다음 값 설정:

```env
SPOTIFY_CLIENT_ID=여기에_클라이언트_ID_붙여넣기
SPOTIFY_CLIENT_SECRET=여기에_클라이언트_시크릿_붙여넣기
```

### 6단계: 프론트엔드 설정

```bash
# 프론트엔드 폴더로 이동
cd ../frontend

# Node.js 패키지 설치
npm install
```

**만약 설치 중 오류가 발생하면:**
```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json  # Linux/macOS
# Windows에서는: rmdir /s node_modules && del package-lock.json

npm install
```

## 🚀 실행하기

### 방법 1: 자동 실행 스크립트 (Windows)
```powershell
# 프로젝트 루트 폴더에서
.\start.ps1
```

### 방법 2: 수동 실행

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

## 🌐 접속 및 테스트

설치가 완료되면 다음 주소로 접속:

- **메인 앱**: http://localhost:3000 (또는 http://localhost:5173)
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

### 기본 로그인 정보
- **사용자명**: `aaaa`
- **비밀번호**: `123456`

## 🔍 설치 확인 체크리스트

다음 항목들을 확인해보세요:

- [ ] Python 3.8+ 설치됨 (`python --version`)
- [ ] Node.js 16+ 설치됨 (`node --version`)
- [ ] 프로젝트 다운로드 완료
- [ ] Python 가상환경 생성 및 활성화
- [ ] Python 패키지 설치 완료 (`pip list`)
- [ ] `.env` 파일 생성 및 Spotify API 키 설정
- [ ] 데이터베이스 초기화 완료
- [ ] Node.js 패키지 설치 완료 (`npm list`)
- [ ] 백엔드 서버 실행 (http://localhost:8000)
- [ ] 프론트엔드 서버 실행 (http://localhost:3000)
- [ ] 로그인 테스트 성공

## 🚨 문제 해결

### 자주 발생하는 오류들

#### 1. Python 패키지 설치 오류
```bash
# PyTorch 설치 오류 시
pip install torch --index-url https://download.pytorch.org/whl/cpu

# 전체 재설치
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

#### 2. Node.js 패키지 설치 오류
```bash
# 관리자 권한으로 실행 (Windows)
# 또는 sudo 사용 (macOS/Linux)

# 캐시 정리 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 3. 포트 충돌 오류
```bash
# 다른 포트 사용
# 백엔드
uvicorn app.main:app --reload --port 8001

# 프론트엔드
npm run dev -- --port 3001
```

#### 4. Spotify API 오류
- `.env` 파일의 API 키가 올바른지 확인
- Spotify Developer Dashboard에서 앱 설정 확인
- Redirect URI가 정확한지 확인: `http://localhost:8000/api/v1/spotify/callback`

#### 5. 데이터베이스 오류
```bash
cd backend
rm emotion_app.db  # 기존 DB 삭제
python init_db.py  # 재생성
```

#### 6. 가상환경 활성화 오류 (Windows)
```powershell
# PowerShell 실행 정책 변경
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 그 후 가상환경 활성화
venv\Scripts\Activate.ps1
```

## 📱 사용법

1. **로그인**: 기본 계정 (aaaa/123456) 또는 새 계정 생성
2. **일기 작성**: 감정이 담긴 텍스트 입력
3. **감정 분석**: AI가 자동으로 감정 분석
4. **음악 추천**: 분석된 감정에 맞는 Spotify 음악 추천
5. **히스토리**: 과거 일기와 감정 통계 확인

## 🔄 업데이트 받기

나중에 프로젝트 업데이트를 받으려면:

```bash
# Git을 사용한 경우
git pull origin main

# ZIP 다운로드한 경우
# 새로운 ZIP 파일을 다운받아서 덮어쓰기
```

## 🆘 추가 도움이 필요한 경우

1. 모든 단계를 순서대로 따라했는지 확인
2. 오류 메시지를 자세히 읽고 해당하는 문제 해결 방법 시도
3. Python과 Node.js 버전이 요구사항을 만족하는지 확인
4. 방화벽이나 안티바이러스가 포트를 차단하지 않는지 확인

---

이 가이드를 따라하면 GitHub에서 다운받은 프로젝트를 어떤 컴퓨터에서든 성공적으로 실행할 수 있습니다! 🎉

## 📋 요약 명령어 (빠른 참조)

```bash
# 1. 프로젝트 다운로드
git clone https://github.com/SangRyeolJeong/emotion-music-app.git
cd emotion-music-app

# 2. 백엔드 설정
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
copy env.example .env  # Spotify API 키 설정 필요!
python init_db.py

# 3. 프론트엔드 설정
cd ../frontend
npm install

# 4. 실행
# 터미널 1: cd backend && uvicorn app.main:app --reload
# 터미널 2: cd frontend && npm run dev
```
