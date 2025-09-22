# Emotion Music App - Frontend

React + TypeScript 기반의 감정 분석 음악 추천 프론트엔드입니다.

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 빌드

```bash
npm run build
npm run preview  # 빌드된 앱 미리보기
```

## 주요 기능

### 일기 작성 페이지 (`/`)
- 텍스트 입력으로 일기 작성
- 실시간 감정 분석
- 감정 기반 음악 추천
- 일기 저장 기능

### 히스토리 페이지 (`/history`)
- 과거 일기 목록
- 감정 통계 차트
- 감정 분포 시각화
- 트렌드 분석

## 컴포넌트 구조

### Pages (`src/pages/`)
- `DiaryEditor.tsx`: 메인 일기 작성 페이지
- `History.tsx`: 히스토리 및 통계 페이지

### Components (`src/components/`)
- `Navigation.tsx`: 네비게이션 바
- `EmotionChips.tsx`: 감정 칩 표시
- `TrackCard.tsx`: 음악 트랙 카드

### API (`src/api/`)
- `client.ts`: Axios 기본 설정
- `analyze.ts`: 감정 분석 API
- `recommend.ts`: 음악 추천 API  
- `diaries.ts`: 일기 관리 API

### Store (`src/store/`)
- `useDiaryStore.ts`: Zustand 전역 상태 관리

## 기술 스택

- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구
- **Material-UI**: UI 컴포넌트 라이브러리
- **Zustand**: 경량 상태 관리
- **Recharts**: 차트 라이브러리
- **Axios**: HTTP 클라이언트
- **React Router**: 라우팅

## 개발 가이드

### 새로운 페이지 추가

1. `src/pages/`에 컴포넌트 생성
2. `src/App.tsx`에 라우트 추가
3. `src/components/Navigation.tsx`에 네비게이션 추가

### 새로운 API 연결

1. `src/api/`에 API 함수 정의
2. TypeScript 타입 정의
3. 컴포넌트에서 사용

### 상태 관리

```typescript
// Zustand 스토어 사용 예시
import { useDiaryStore } from '../store/useDiaryStore'

function MyComponent() {
  const { currentText, setText } = useDiaryStore()
  
  return (
    <input 
      value={currentText} 
      onChange={(e) => setText(e.target.value)} 
    />
  )
}
```

### 스타일링

Material-UI의 `sx` prop을 사용하여 스타일링:

```typescript
<Box sx={{ 
  display: 'flex', 
  gap: 2, 
  mt: 2 
}}>
  // 컴포넌트
</Box>
```

## 환경 설정

### 개발 환경
- 개발 서버는 포트 3000에서 실행
- API 프록시는 localhost:8000으로 설정

### 프로덕션 빌드
```bash
npm run build
# dist/ 폴더에 빌드 결과 생성
```

## 주요 라이브러리

### UI 컴포넌트
```typescript
import { 
  Button, 
  TextField, 
  Card, 
  Typography 
} from '@mui/material'
```

### 차트
```typescript
import { 
  BarChart, 
  PieChart, 
  ResponsiveContainer 
} from 'recharts'
```

### 상태 관리
```typescript
import { create } from 'zustand'
```

### 날짜 처리
```typescript
import dayjs from 'dayjs'
```
