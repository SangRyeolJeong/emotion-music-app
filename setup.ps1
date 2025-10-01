# Emotion Music App 자동 설치 스크립트 (Windows PowerShell)

Write-Host "=== Emotion Music App 자동 설치 시작 ===" -ForegroundColor Green

# 1. Python 및 Node.js 확인
Write-Host "시스템 요구사항 확인 중..." -ForegroundColor Yellow

try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python: $pythonVersion" -ForegroundColor Cyan
} catch {
    Write-Host "오류: Python이 설치되지 않았습니다. Python 3.8 이상을 설치해주세요." -ForegroundColor Red
    exit 1
}

try {
    $nodeVersion = node --version 2>&1
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "오류: Node.js가 설치되지 않았습니다. Node.js 16 이상을 설치해주세요." -ForegroundColor Red
    exit 1
}

# 2. 백엔드 설정
Write-Host "`n백엔드 설정 중..." -ForegroundColor Yellow

# 가상환경 생성
if (!(Test-Path "backend\venv")) {
    Write-Host "Python 가상환경 생성 중..." -ForegroundColor Cyan
    cd backend
    python -m venv venv
    cd ..
}

# 가상환경 활성화 및 패키지 설치
Write-Host "백엔드 패키지 설치 중..." -ForegroundColor Cyan
cd backend
& "venv\Scripts\Activate.ps1"
pip install --upgrade pip
pip install -r requirements.txt

# .env 파일 확인
if (!(Test-Path ".env")) {
    Write-Host ".env 파일 생성 중..." -ForegroundColor Cyan
    Copy-Item "env.example" ".env"
    Write-Host "중요: backend\.env 파일에서 Spotify API 키를 설정해주세요!" -ForegroundColor Red
}

# 데이터베이스 초기화
Write-Host "데이터베이스 초기화 중..." -ForegroundColor Cyan
python init_db.py

cd ..

# 3. 프론트엔드 설정
Write-Host "`n프론트엔드 설정 중..." -ForegroundColor Yellow
cd frontend

Write-Host "프론트엔드 패키지 설치 중..." -ForegroundColor Cyan
npm install

cd ..

# 4. 설치 완료
Write-Host "`n=== 설치 완료! ===" -ForegroundColor Green
Write-Host "`n다음 단계:" -ForegroundColor Yellow
Write-Host "1. backend\.env 파일에서 Spotify API 키 설정" -ForegroundColor White
Write-Host "2. .\start.ps1 실행하여 앱 시작" -ForegroundColor White
Write-Host "`n접속 주소:" -ForegroundColor Yellow
Write-Host "- 프론트엔드: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- 백엔드 API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "- API 문서: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "`n기본 로그인: 사용자명=aaaa, 비밀번호=123456" -ForegroundColor Magenta
