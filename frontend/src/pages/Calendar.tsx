import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, IconButton } from '@mui/material'
import { EMOTION_EMOJIS, DEFAULT_EMOJI } from '../constants/emotions'
import { getDiaries, DiaryResponse } from '../api/diaries'
import { getUserInfo } from '../api/auth'
import { CalendarToday as CalendarIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material'
import { GlassCard } from '../components/GlassCard'
import { AnimatedBackground } from '../components/AnimatedBackground'

type DiaryEntry = DiaryResponse

// emoji mapping is centralized in ../constants/emotions

const Calendar = () => {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])

  // YYYY-MM-DD (local) 포맷 생성
  const toLocalYmd = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // 현재 월 기준 일기 목록 로드
  useEffect(() => {
    const load = async () => {
      try {
        // 1) 우선 캐시된 user_id 사용
        let userId: string | null = localStorage.getItem('user_id')
        // 2) 없으면 username으로 조회하여 한 번만 갱신 시도
        if (!userId) {
          const username = localStorage.getItem('username')
          if (username) {
            try {
              const user = await getUserInfo(username)
              userId = String(user.id)
              localStorage.setItem('user_id', userId)
            } catch {
              userId = null
            }
          }
        }
        // 한 달 표시를 위해 여유 있게 62개 로드
        if (!userId) {
          setDiaryEntries([])
          return
        }
        const list = await getDiaries(parseInt(userId), 62)
        setDiaryEntries(list)
      } catch (e) {
        setDiaryEntries([])
      }
    }
    load()
  }, [currentDate])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // 달의 첫날과 마지막날
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 첫 주의 시작 (일요일)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  // 마지막 주의 끝 (토요일)
  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))

  // 캘린더에 표시할 날짜들 생성
  const calendarDays = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    calendarDays.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    const dateString = toLocalYmd(date)
    navigate(`/diary/${dateString}`)
  }

  const getEmotionForDate = (date: Date) => {
    const dateString = toLocalYmd(date)
    const entry = diaryEntries.find(entry => entry.date === dateString)
    return entry?.emotion || null
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <AnimatedBackground />
      
      <Box sx={{ 
        padding: '20px',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
            <CalendarIcon sx={{ 
              color: '#FFD700', 
              fontSize: '2rem', 
              mr: 1.5,
              filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.4))',
            }} />
            <Typography 
              variant="h4" 
              sx={{ 
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: '"Crimson Text", "Times New Roman", serif',
                fontWeight: 600,
                letterSpacing: '1.5px',
                fontVariant: 'small-caps',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              }}
            >
              Emotion Calendar
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              fontWeight: 300,
            }}
          >
            감정으로 채워가는 나만의 달력 📅
          </Typography>
        </Box>

        {/* Month Navigation */}
        <GlassCard sx={{ p: 3, mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
          }}>
            <IconButton 
              onClick={handlePrevMonth} 
              sx={{ 
                color: '#FFD700',
                background: 'rgba(255, 215, 0, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 215, 0, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            
            <Typography 
              variant="h5" 
              sx={{ 
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                letterSpacing: '0.5px',
                textAlign: 'center',
                flex: 1,
              }}
            >
              {year}년 {month + 1}월
            </Typography>
            
            <IconButton 
              onClick={handleNextMonth} 
              sx={{ 
                color: '#FFD700',
                background: 'rgba(255, 215, 0, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 215, 0, 0.2)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </GlassCard>

        {/* Calendar Grid */}
        <GlassCard sx={{ p: 3 }}>
          {/* Days of week */}
          <Grid container spacing={0} sx={{ mb: 2 }}>
            {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
              <Grid item xs={12/7} key={day}>
                <Typography 
                  sx={{ 
                    textAlign: 'center', 
                    py: 2, 
                    color: index === 0 ? '#ff6b6b' : index === 6 ? '#4ecdc4' : '#FFD700',
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}
                >
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Calendar grid */}
          <Grid container spacing={1}>
            {calendarDays.map((date, index) => {
              const emotion = getEmotionForDate(date)
              const emoji = emotion ? (EMOTION_EMOJIS[emotion] || DEFAULT_EMOJI) : null
              const today = isToday(date)
              const currentMonth = isCurrentMonth(date)
              
              return (
                <Grid item xs={12/7} key={index}>
                  <Box
                    onClick={() => handleDateClick(date)}
                    sx={{
                      minHeight: '75px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      position: 'relative',
                      background: today 
                        ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.1))'
                        : emotion 
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'transparent',
                      border: today 
                        ? '2px solid #FFD700'
                        : emotion 
                        ? '1px solid rgba(255, 215, 0, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      opacity: currentMonth ? 1 : 0.4,
                      '&:hover': {
                        background: today 
                          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.2))'
                          : 'rgba(255, 215, 0, 0.1)',
                        transform: 'translateY(-2px) scale(1.02)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.2)',
                        border: '1px solid rgba(255, 215, 0, 0.5)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Date number */}
                    <Typography 
                      sx={{ 
                        fontSize: '16px',
                        color: today ? '#FFD700' : (currentMonth ? '#fff' : '#666'),
                        fontWeight: today ? 700 : emotion ? 600 : 400,
                        mb: emoji ? 1 : 0,
                        textShadow: today ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
                      }}
                    >
                      {date.getDate()}
                    </Typography>
                    
                    {/* Emotion emoji if exists */}
                    {emoji && (
                      <Box sx={{ 
                        fontSize: '18px',
                        filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))',
                        opacity: 0.9,
                      }}>
                        {emoji}
                      </Box>
                    )}
                    
                    {/* Today indicator */}
                    {today && (
                      <Box sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        boxShadow: '0 0 12px rgba(255, 215, 0, 0.8)',
                        animation: 'blink 1.5s ease-in-out infinite',
                        '@keyframes blink': {
                          '0%': { opacity: 1 },
                          '50%': { opacity: 0.5 },
                          '100%': { opacity: 1 },
                        },
                      }} />
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </GlassCard>
      </Box>
    </Box>
  )
}

export default Calendar
