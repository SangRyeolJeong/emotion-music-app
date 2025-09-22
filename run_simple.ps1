# 간단한 실행 스크립트
Write-Host "Emotion Music App 시작 중..." -ForegroundColor Green

# Python 3.11 경로 설정
$python311 = "C:\Users\user\AppData\Local\Microsoft\WindowsApps\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\python.exe"

Write-Host "백엔드 서버 시작 중..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList "-Command", "cd '$PWD\backend'; $python311 simple_main.py"

Start-Sleep -Seconds 3

Write-Host "프론트엔드 서버 시작 중..." -ForegroundColor Yellow  
Start-Process PowerShell -ArgumentList "-Command", "cd '$PWD\frontend'; npm run dev"

Start-Sleep -Seconds 5

Write-Host "서버들이 시작되었습니다!" -ForegroundColor Green
Write-Host "프론트엔드: http://localhost:3000" -ForegroundColor Cyan
Write-Host "백엔드 API: http://localhost:8000" -ForegroundColor Cyan

# 브라우저 열기
Start-Process "http://localhost:3000"
