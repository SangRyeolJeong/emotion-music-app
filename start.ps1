# Emotion Music App 시작 스크립트 (Windows PowerShell)

Write-Host "Emotion Music App 시작 중..." -ForegroundColor Green

# 백엔드 실행
Write-Host "백엔드 서버 시작 중..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList "-Command", "cd backend; python init_db.py; uvicorn app.main:app --reload --port 8000"

# 잠시 대기
Start-Sleep -Seconds 3

# 프론트엔드 실행  
Write-Host "프론트엔드 서버 시작 중..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList "-Command", "cd frontend; npm run dev"

Write-Host "서버들이 시작되었습니다!" -ForegroundColor Green
Write-Host "프론트엔드: http://localhost:3000" -ForegroundColor Cyan
Write-Host "백엔드 API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API 문서: http://localhost:8000/docs" -ForegroundColor Cyan

# 브라우저 열기 (선택)
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
