# 🎵 Spotify API 연동 가이드

## 1. Spotify for Developers 계정 설정

### 1.1 개발자 계정 생성
1. [Spotify for Developers](https://developer.spotify.com) 접속
2. Spotify 계정으로 로그인 (없으면 생성)
3. Dashboard 접속

### 1.2 앱 등록
1. **Create an App** 클릭
2. 앱 정보 입력:
   - **App name**: Emotion Music App
   - **App description**: AI 감정 분석 기반 음악 추천 서비스
   - **Website**: http://localhost:3000 (개발용)
   - **Redirect URI**: http://localhost:3000/callback (나중에 사용자 인증이 필요할 때)
3. **Web API**와 **Web Playback SDK** 체크
4. 약관 동의 후 **Create** 클릭

### 1.3 자격증명 복사
1. 생성된 앱 클릭
2. **Settings** 클릭
3. **Client ID**와 **Client Secret** 복사 (Show client secret 클릭)

## 2. 환경 변수 설정

### 2.1 .env 파일 생성
`backend` 폴더에 `.env` 파일을 생성하고 다음 내용을 추가:

```bash
# Model Configuration
MODEL_DIR=./models/goemotions_bert
MAX_LEN=256
THRESHOLD=0.30
TOPK=3

# Database Configuration
DATABASE_URL=sqlite:///./emotion_app.db

# Spotify API Configuration
SPOTIFY_CLIENT_ID=여기에_실제_클라이언트_ID_입력
SPOTIFY_CLIENT_SECRET=여기에_실제_클라이언트_시크릿_입력

# App Configuration  
APP_NAME=Emotion Music App
DEBUG=true
```

### 2.2 중요 보안 사항
- ⚠️ **Client Secret은 절대 GitHub에 커밋하지 마세요!**
- `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- 팀원들과는 개별적으로 자격증명을 공유

## 3. 테스트 방법

### 3.1 백엔드 서버 시작
```powershell
cd backend
uvicorn app.main:app --reload --port 8000
```

### 3.2 Spotify 연결 테스트
브라우저에서 다음 URL들을 테스트:

1. **연결 테스트**: http://localhost:8000/v1/recommend/test
2. **장르 목록**: http://localhost:8000/v1/recommend/genres  
3. **API 문서**: http://localhost:8000/docs

### 3.3 추천 API 테스트
FastAPI Swagger UI(http://localhost:8000/docs)에서:

```json
POST /v1/recommend/recommend
{
  "selected": [
    {"label": "joy", "probability": 0.8},
    {"label": "excitement", "probability": 0.6}
  ],
  "limit": 10
}
```

## 4. 주요 기능

### 4.1 Client Credentials Flow
- **자동 토큰 발급**: 서버 시작 시 자동으로 액세스 토큰 발급
- **자동 갱신**: 토큰 만료 시 spotipy가 자동으로 갱신
- **사용자 개입 불필요**: 별도의 로그인 과정 없음

### 4.2 제공하는 API
- `/v1/recommend/recommend` - 감정 기반 음악 추천
- `/v1/recommend/genres` - 사용 가능한 장르 목록
- `/v1/recommend/test` - Spotify 연결 테스트

### 4.3 감정 → 음악 매핑
| 감정 | Valence | Energy | 주요 장르 |
|------|---------|--------|-----------|
| Joy | 0.8 | 0.7 | pop, dance |
| Sadness | 0.2 | 0.3 | indie, folk |
| Anger | 0.3 | 0.9 | rock, metal |
| Calm | 0.6 | 0.2 | ambient, chill |

## 5. 문제 해결

### 5.1 자주 발생하는 오류

#### 🔴 "Spotify credentials not configured"
- `.env` 파일에 `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` 설정 확인
- 값이 실제 Spotify에서 발급받은 것인지 확인

#### 🔴 "Failed to authenticate with Spotify"
- Client ID/Secret이 올바른지 확인
- Spotify 개발자 대시보드에서 앱 상태 확인

#### 🔴 "Invalid client"
- Client Secret를 다시 생성해야 할 수도 있음
- Spotify 앱 설정에서 새로 생성 후 `.env` 업데이트

### 5.2 디버깅 방법
```python
# 로그 레벨을 DEBUG로 설정하여 상세 정보 확인
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 6. 향후 확장 계획

### 6.1 사용자 인증 (Authorization Code Flow)
현재는 **Client Credentials Flow**만 구현되어 있어서:
- ✅ 곡 검색, 추천 가능
- ❌ 사용자 플레이리스트 생성/수정 불가
- ❌ 사용자 음악 히스토리 접근 불가

사용자 계정 연동이 필요하면 **Authorization Code Flow** 추가 구현 필요.

### 6.2 고급 기능
- **실시간 재생**: Web Playback SDK 활용
- **플레이리스트 생성**: 사용자 계정 연동 후 가능
- **음악 특성 분석**: Audio Features API 활용한 더 정교한 매칭

---

## 💡 팁

1. **개발 중에는** Spotify Free 계정으로도 충분
2. **배포 시에는** Quota Limits 확인 (하루 10,000 API 호출)
3. **팀 작업 시에는** 각자 개별 Spotify 앱을 생성하는 것을 권장
4. **프로덕션에서는** 환경변수를 서버 환경에 안전하게 설정

질문이 있거나 문제가 발생하면 언제든 말해주세요! 🎵
