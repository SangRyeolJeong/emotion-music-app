import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { EMOTION_EMOJIS, DEFAULT_EMOJI } from '../constants/emotions'

interface EmotionStat {
  emotion: string
  count: number
  percentage: number
}

interface EmotionDonutProps {
  emotionStats: EmotionStat[]
  emotionConfig: Record<string, { color: string; koreanName: string }>
}

export const EmotionDonut = ({ emotionStats, emotionConfig }: EmotionDonutProps) => {
  const [animationProgress, setAnimationProgress] = useState(0)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [emotionStats])

  if (emotionStats.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '300px',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '16px' }}>
          아직 감정 데이터가 없어요
        </Typography>
      </Box>
    )
  }

  const total = emotionStats.reduce((sum, stat) => sum + stat.count, 0)
  const radius = 80
  const strokeWidth = 20
  const centerX = 100
  const centerY = 100
  
  // 호를 그리기 위한 헬퍼 함수
  const createArcPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const start1 = polarToCartesian(centerX, centerY, outerRadius, endAngle)
    const end1 = polarToCartesian(centerX, centerY, outerRadius, startAngle)
    const start2 = polarToCartesian(centerX, centerY, innerRadius, endAngle)
    const end2 = polarToCartesian(centerX, centerY, innerRadius, startAngle)
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", start1.x, start1.y, 
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end1.x, end1.y,
      "L", end2.x, end2.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, start2.x, start2.y,
      "Z"
    ].join(" ")
  }
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }
  
  let currentAngle = 0 // 12시 방향부터 시작

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      p: 3,
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#FFD700',
          fontWeight: 600,
          mb: 3,
          textAlign: 'center',
        }}
      >
        🎭 감정 분포도
      </Typography>

      <Box sx={{ position: 'relative', mb: 3 }}>
        {/* SVG 도넛 차트 */}
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* 배경 원 */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          
          {/* 감정별 호 */}
          {emotionStats.map((stat, index) => {
            const config = emotionConfig[stat.emotion] || { color: '#FFD700', koreanName: stat.emotion }
            const percentage = (stat.count / total) * 100
            const angle = (percentage / 100) * 360 * animationProgress
            
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            const innerRadius = radius - strokeWidth / 2
            const outerRadius = radius + strokeWidth / 2
            
            const pathData = createArcPath(startAngle, endAngle, innerRadius, outerRadius)
            
            const arcElement = (
              <path
                key={stat.emotion}
                d={pathData}
                fill={config.color}
                style={{
                  transition: `all 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`,
                  filter: selectedEmotion === stat.emotion ? `drop-shadow(0 0 15px ${config.color})` : 'none',
                  cursor: 'pointer',
                  opacity: selectedEmotion && selectedEmotion !== stat.emotion ? 0.6 : 1,
                }}
                onMouseEnter={() => setSelectedEmotion(stat.emotion)}
                onMouseLeave={() => setSelectedEmotion(null)}
              />
            )
            
            currentAngle += (percentage / 100) * 360 // 실제 각도만큼 증가
            return arcElement
          })}
        </svg>

        {/* 중앙 정보 */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          {selectedEmotion ? (
            <>
              <Typography sx={{ 
                fontSize: '24px',
                mb: 1,
              }}>
                {EMOTION_EMOJIS[selectedEmotion] || DEFAULT_EMOJI}
              </Typography>
              <Typography sx={{ 
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: 600,
              }}>
                {emotionConfig[selectedEmotion]?.koreanName || selectedEmotion}
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px',
              }}>
                {emotionStats.find(s => s.emotion === selectedEmotion)?.count}회
              </Typography>
            </>
          ) : (
            <>
              <Typography sx={{ 
                color: '#FFD700',
                fontSize: '20px',
                fontWeight: 600,
                mb: 1,
              }}>
                {total}
              </Typography>
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px',
              }}>
                총 기록
              </Typography>
            </>
          )}
        </Box>
      </Box>

      {/* 범례 */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        justifyContent: 'center',
        maxWidth: '300px',
      }}>
        {emotionStats.slice(0, 5).map((stat) => {
          const config = emotionConfig[stat.emotion] || { color: '#FFD700', koreanName: stat.emotion }
          return (
            <Box
              key={stat.emotion}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: '20px',
                background: selectedEmotion === stat.emotion 
                  ? `rgba(${parseInt(config.color.slice(1, 3), 16)}, ${parseInt(config.color.slice(3, 5), 16)}, ${parseInt(config.color.slice(5, 7), 16)}, 0.2)`
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${selectedEmotion === stat.emotion ? config.color : 'rgba(255, 255, 255, 0.1)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: `rgba(${parseInt(config.color.slice(1, 3), 16)}, ${parseInt(config.color.slice(3, 5), 16)}, ${parseInt(config.color.slice(5, 7), 16)}, 0.15)`,
                  transform: 'scale(1.05)',
                }
              }}
              onMouseEnter={() => setSelectedEmotion(stat.emotion)}
              onMouseLeave={() => setSelectedEmotion(null)}
            >
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: config.color,
                  boxShadow: `0 0 8px ${config.color}66`,
                }}
              />
              <Typography sx={{ 
                color: '#fff',
                fontSize: '12px',
                fontWeight: 500,
              }}>
                {config.koreanName}
              </Typography>
              <Typography sx={{ 
                color: config.color,
                fontSize: '11px',
                fontWeight: 600,
              }}>
                {stat.percentage.toFixed(1)}%
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
