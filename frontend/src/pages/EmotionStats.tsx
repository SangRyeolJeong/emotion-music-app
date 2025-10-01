import { useState, useEffect } from 'react'
import { Box, Typography, Grid, Card, CardContent, IconButton } from '@mui/material'
import { BarChart as BarChartIcon, TrendingUp as TrendingUpIcon, Psychology as PsychologyIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, CalendarToday as CalendarIcon } from '@mui/icons-material'
import { EMOTION_EMOJIS, DEFAULT_EMOJI } from '../constants/emotions'
import { getDiaries } from '../api/diaries'
import { GlassCard } from '../components/GlassCard'
import { AnimatedBackground } from '../components/AnimatedBackground'
import { EmotionChart } from '../components/EmotionChart'
import { EmotionDonut } from '../components/EmotionDonut'

interface EmotionStat {
  emotion: string
  count: number
  percentage: number
}

// 감정별 색상과 한국어 이름 매핑 (GoEmotions 28개 라벨 기준)
const emotionConfig: Record<string, { color: string; koreanName: string }> = {
  // 긍정적 감정들
  admiration: { color: '#FFD700', koreanName: '감탄' },
  amusement: { color: '#FFEB3B', koreanName: '재미' },
  approval: { color: '#4CAF50', koreanName: '승인' },
  caring: { color: '#FF69B4', koreanName: '배려' },
  excitement: { color: '#FF6B35', koreanName: '흥분' },
  gratitude: { color: '#9C27B0', koreanName: '감사' },
  joy: { color: '#FFD700', koreanName: '기쁨' },
  love: { color: '#E91E63', koreanName: '사랑' },
  optimism: { color: '#FFC107', koreanName: '낙관' },
  pride: { color: '#FF9800', koreanName: '자부심' },
  relief: { color: '#00BCD4', koreanName: '안도' },
  
  // 부정적 감정들
  anger: { color: '#F44336', koreanName: '분노' },
  annoyance: { color: '#FF5722', koreanName: '짜증' },
  disappointment: { color: '#3F51B5', koreanName: '실망' },
  disapproval: { color: '#795548', koreanName: '반대' },
  disgust: { color: '#8BC34A', koreanName: '혐오' },
  embarrassment: { color: '#E91E63', koreanName: '당황' },
  fear: { color: '#9C27B0', koreanName: '두려움' },
  grief: { color: '#607D8B', koreanName: '슬픔' },
  nervousness: { color: '#FF9800', koreanName: '긴장' },
  remorse: { color: '#795548', koreanName: '후회' },
  sadness: { color: '#2196F3', koreanName: '슬픔' },
  
  // 중성적/복합적 감정들
  confusion: { color: '#9E9E9E', koreanName: '혼란' },
  curiosity: { color: '#00BCD4', koreanName: '호기심' },
  desire: { color: '#E91E63', koreanName: '욕망' },
  neutral: { color: '#9E9E9E', koreanName: '중립' },
  realization: { color: '#FFEB3B', koreanName: '깨달음' },
  surprise: { color: '#FF9800', koreanName: '놀라움' },
}

const EmotionStats = () => {
  const [emotionStats, setEmotionStats] = useState<EmotionStat[]>([])
  const [totalEntries, setTotalEntries] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const loadEmotionStats = async () => {
      try {
        // 사용자의 일기 목록에서 감정 통계 추출
        let userId: string | null = localStorage.getItem('user_id')
        if (!userId) {
          const username = localStorage.getItem('username')
          if (username) {
            try {
              const { getUserInfo } = await import('../api/auth')
              const user = await getUserInfo(username)
              userId = String(user.id)
              localStorage.setItem('user_id', userId)
            } catch {
              userId = null
            }
          }
        }
        
        if (!userId) {
          setEmotionStats([])
          setTotalEntries(0)
          return
        }

        const diaries = await getDiaries(parseInt(userId), 100) // 많은 수의 일기 로드
        
        // 현재 월의 일기들만 필터링
        const currentYear = currentMonth.getFullYear()
        const currentMonthNum = currentMonth.getMonth()
        
        const monthlyDiaries = diaries.filter(diary => {
          const diaryDate = new Date(diary.date)
          return diaryDate.getFullYear() === currentYear && 
                 diaryDate.getMonth() === currentMonthNum
        })
        
        // 감정별 카운트 집계
        const emotionCounts: Record<string, number> = {}
        let totalCount = 0
        
        monthlyDiaries.forEach(diary => {
          if (diary.emotion) {
            emotionCounts[diary.emotion] = (emotionCounts[diary.emotion] || 0) + 1
            totalCount++
          }
        })
        
        // 배열로 변환하고 내림차순 정렬
        const stats: EmotionStat[] = Object.entries(emotionCounts)
          .map(([emotion, count]) => ({
            emotion,
            count,
            percentage: totalCount > 0 ? (count / totalCount) * 100 : 0
          }))
          .sort((a, b) => b.count - a.count)
        
        setEmotionStats(stats)
        setTotalEntries(totalCount)
      } catch (error) {
        console.error('감정 통계 로딩 실패:', error)
        setEmotionStats([])
        setTotalEntries(0)
      }
    }

    loadEmotionStats()
  }, [currentMonth])

  // 월 네비게이션 함수들
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const handleToday = () => {
    setCurrentMonth(new Date())
  }

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
  }

  const getMostFrequentEmotion = () => {
    if (emotionStats.length === 0) return null
    return emotionStats.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    )
  }

  const mostFrequent = getMostFrequentEmotion()

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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <BarChartIcon sx={{ 
              color: '#FFD700', 
              fontSize: '3rem', 
              mr: 2,
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' },
              },
            }} />
            <Typography 
              variant="h3" 
              sx={{ 
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              Emotion Analytics
            </Typography>
          </Box>
          {/* 월 네비게이션 */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2,
            gap: 2
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
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '12px',
              px: 3,
              py: 1,
              border: '1px solid rgba(255, 215, 0, 0.3)',
            }}>
              <CalendarIcon sx={{ color: '#FFD700', mr: 1, fontSize: '20px' }} />
              <Typography 
                sx={{ 
                  color: '#FFD700',
                  fontSize: '18px',
                  fontWeight: 600,
                  minWidth: '140px',
                  textAlign: 'center',
                }}
              >
                {formatMonth(currentMonth)}
              </Typography>
            </Box>
            
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
            
            <IconButton 
              onClick={handleToday}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFD700',
                },
                transition: 'all 0.3s ease',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
              }}
              title="이번 달로 이동"
            >
              오늘
            </IconButton>
          </Box>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '18px',
              fontWeight: 300,
              mb: 1,
            }}
          >
            감정 분석 리포트 📊
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
            }}
          >
            당신의 감정 패턴을 시각적으로 분석해보세요 ✨
          </Typography>
        </Box>

        {/* 요약 카드들 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* 총 기록 수 */}
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard sx={{ p: 3, textAlign: 'center', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ color: '#FFD700', fontSize: '2rem', fontWeight: 700, mb: 1 }}>
                {totalEntries}
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                총 감정 기록
              </Typography>
            </GlassCard>
          </Grid>

          {/* 감정 종류 */}
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard sx={{ p: 3, textAlign: 'center', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ color: '#4CAF50', fontSize: '2rem', fontWeight: 700, mb: 1 }}>
                {emotionStats.length}
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                다양한 감정 종류
              </Typography>
            </GlassCard>
          </Grid>

          {/* 가장 빈번한 감정 */}
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard sx={{ p: 3, textAlign: 'center', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {mostFrequent ? (
                <>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>
                    {EMOTION_EMOJIS[mostFrequent.emotion] || DEFAULT_EMOJI}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                    {emotionConfig[mostFrequent.emotion]?.koreanName || mostFrequent.emotion}
                  </Typography>
                </>
              ) : (
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                  데이터 없음
                </Typography>
              )}
            </GlassCard>
          </Grid>

          {/* 평균 감정 빈도 */}
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard sx={{ p: 3, textAlign: 'center', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{ color: '#FF9800', fontSize: '2rem', fontWeight: 700, mb: 1 }}>
                {emotionStats.length > 0 ? (totalEntries / emotionStats.length).toFixed(1) : '0'}
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                평균 감정 빈도
              </Typography>
            </GlassCard>
          </Grid>
        </Grid>

        {/* 차트 섹션 */}
        <Grid container spacing={3}>
          {/* 도넛 차트 */}
          <Grid item xs={12} md={6}>
            <GlassCard>
              <EmotionDonut 
                emotionStats={emotionStats} 
                emotionConfig={emotionConfig}
              />
            </GlassCard>
          </Grid>

          {/* 바 차트 */}
          <Grid item xs={12} md={6}>
            <GlassCard>
              <EmotionChart 
                emotionStats={emotionStats} 
                emotionConfig={emotionConfig}
              />
            </GlassCard>
          </Grid>

          {/* 세부 통계 */}
          <Grid item xs={12}>
            <GlassCard sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#FFD700',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <PsychologyIcon />
                감정별 상세 분석
              </Typography>
              
              {emotionStats.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
                    아직 이번 달 감정 기록이 없어요
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>
                    일기를 작성해서 감정을 기록해보세요 ✨
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {emotionStats.map((stat, index) => {
                    const config = emotionConfig[stat.emotion] || { color: '#FFD700', koreanName: stat.emotion }
                    return (
                      <Grid item xs={12} sm={6} md={4} key={stat.emotion}>
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: `1px solid ${config.color}33`,
                          borderRadius: '12px',
                          p: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            border: `1px solid ${config.color}66`,
                            boxShadow: `0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px ${config.color}22`,
                          },
                          animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                          '@keyframes slideInUp': {
                            '0%': {
                              opacity: 0,
                              transform: 'translateY(20px)',
                            },
                            '100%': {
                              opacity: 1,
                              transform: 'translateY(0)',
                            },
                          },
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ 
                              fontSize: '20px', 
                              mr: 2,
                              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))'
                            }}>
                              {EMOTION_EMOJIS[stat.emotion] || DEFAULT_EMOJI}
                            </Box>
                            <Typography sx={{ 
                              color: '#fff',
                              fontSize: '14px',
                              fontWeight: 500,
                              flex: 1,
                            }}>
                              {config.koreanName}
                            </Typography>
                            <Typography sx={{ 
                              color: config.color,
                              fontSize: '12px',
                              fontWeight: 600,
                            }}>
                              #{index + 1}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ 
                              color: config.color,
                              fontSize: '18px',
                              fontWeight: 700,
                            }}>
                              {stat.count}회
                            </Typography>
                            <Typography sx={{ 
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                            }}>
                              {stat.percentage.toFixed(1)}%
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>
              )}
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default EmotionStats
