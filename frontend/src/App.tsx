import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, GlobalStyles } from '@mui/material'
import { useState, useEffect } from 'react'
import Calendar from './pages/Calendar'
import DiaryEditor from './pages/DiaryEditor'
import MusicHistory from './pages/MusicHistory'
import EmotionStats from './pages/EmotionStats'
import Login from './pages/Login'
import Settings from './pages/Settings'
import { BottomNavigation } from './components/BottomNavigation'

// 전역 스크롤바 스타일
const globalScrollbarStyles = {
  '*::-webkit-scrollbar': {
    width: '10px',
    height: '10px',
  },
  '*::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    margin: '2px',
  },
  '*::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(180deg, #FFD700, #FFA500)',
    borderRadius: '12px',
    border: '2px solid transparent',
    backgroundClip: 'padding-box',
    '&:hover': {
      background: 'linear-gradient(180deg, #FFEB3B, #FF8F00)',
      transform: 'scale(1.05)',
    },
    '&:active': {
      background: 'linear-gradient(180deg, #FFC107, #FF6F00)',
    },
  },
  '*::-webkit-scrollbar-corner': {
    background: 'transparent',
  },
  // Firefox 스크롤바
  '* ': {
    scrollbarWidth: 'thin',
    scrollbarColor: '#FFD700 rgba(255, 255, 255, 0.05)',
  },
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 앱 시작 시 항상 로그아웃 상태로 초기화
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('user_id')
    setIsLoggedIn(false)
    setLoading(false)

    // 로그인/로그아웃 변경 감지 이벤트 리스너
    const handleAuthChange = () => {
      const status = localStorage.getItem('isLoggedIn')
      const user = localStorage.getItem('username')
      const id = localStorage.getItem('user_id')
      
      if (status === 'true' && user && id) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    }

    window.addEventListener('auth-changed', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      window.removeEventListener('auth-changed', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh',
        maxWidth: '700px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Box sx={{ 
          color: '#FFD700',
          fontSize: '24px',
          textAlign: 'center',
        }}>
          🌙<br/>
          감정일기
        </Box>
      </Box>
    )
  }

  if (!isLoggedIn) {
    return <Login />
  }


  return (
    <>
      <GlobalStyles styles={globalScrollbarStyles} />
      <Box sx={{ 
        height: '100vh',
        maxWidth: '700px', // 2배로 늘린 너비
        padding: '20px 10px', // 위아래 패딩 추가
        margin: '0 auto',
        background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
        position: 'relative',
      overflow: 'hidden',
      border: '1px solid #333',
      boxShadow: '0 0 50px rgba(0,0,0,0.5)',
      marginTop: '20px', // 위쪽 여백 추가
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Mobile Content Area */}
      <Box sx={{ 
        height: 'calc(100vh - 80px)', // Bottom nav height 고려
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        scrollbarWidth: 'none',
      }}>
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/diary/:date" element={<DiaryEditor />} />
          <Route path="/music" element={<MusicHistory />} />
          <Route path="/stats" element={<EmotionStats />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
      </Box>
    </>
  )
}

export default App
