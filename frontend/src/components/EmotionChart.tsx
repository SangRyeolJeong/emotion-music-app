import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'

interface EmotionStat {
  emotion: string
  count: number
  percentage: number
}

interface EmotionChartProps {
  emotionStats: EmotionStat[]
  emotionConfig: Record<string, { color: string; koreanName: string }>
}

export const EmotionChart = ({ emotionStats, emotionConfig }: EmotionChartProps) => {
  const [animatedStats, setAnimatedStats] = useState<EmotionStat[]>([])
  
  useEffect(() => {
    // 애니메이션을 위한 지연 상태 업데이트
    const timer = setTimeout(() => {
      setAnimatedStats(emotionStats)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [emotionStats])

  const maxCount = Math.max(...emotionStats.map(stat => stat.count), 1)

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#FFD700',
          fontWeight: 600,
          mb: 3,
          textAlign: 'center',
        }}
      >
        📊 이번 달 감정 분포
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {emotionStats.map((stat, index) => {
          const config = emotionConfig[stat.emotion] || { color: '#FFD700', koreanName: stat.emotion }
          const animatedStat = animatedStats.find(s => s.emotion === stat.emotion) || { ...stat, percentage: 0, count: 0 }
          
          return (
            <Box key={stat.emotion} sx={{ position: 'relative' }}>
              {/* 라벨 */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1,
              }}>
                <Typography sx={{ 
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 500,
                }}>
                  {config.koreanName}
                </Typography>
                <Typography sx={{ 
                  color: config.color,
                  fontSize: '12px',
                  fontWeight: 600,
                }}>
                  {animatedStat.count}회 ({animatedStat.percentage.toFixed(1)}%)
                </Typography>
              </Box>
              
              {/* 진행 바 배경 */}
              <Box sx={{
                width: '100%',
                height: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* 진행 바 */}
                <Box sx={{
                  width: `${animatedStat.percentage}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${config.color}dd, ${config.color})`,
                  borderRadius: '6px',
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: `${index * 0.1}s`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(90deg, transparent, ${config.color}44, transparent)`,
                    animation: 'shimmer 2s infinite',
                    '@keyframes shimmer': {
                      '0%': { transform: 'translateX(-100%)' },
                      '100%': { transform: 'translateX(100%)' },
                    },
                  },
                  // 글로우 효과
                  boxShadow: `0 0 10px ${config.color}66`,
                }} />
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
