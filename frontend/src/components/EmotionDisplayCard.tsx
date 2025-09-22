import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import { GlassCard } from './GlassCard'
import { EMOTION_EMOJIS, DEFAULT_EMOJI } from '../constants/emotions'

interface Emotion {
  label: string
  probability: number
}

interface EmotionDisplayCardProps {
  emotions: Emotion[]
  savedEmotion?: string | null
}

export const EmotionDisplayCard = ({ emotions, savedEmotion }: EmotionDisplayCardProps) => {
  const displayEmotion = savedEmotion || (emotions.length > 0 ? emotions[0].label : null)
  
  if (!displayEmotion && emotions.length === 0) {
    return null
  }

  return (
    <GlassCard variant="gold" sx={{ textAlign: 'center', p: 4 }}>
      {displayEmotion && (
        <>
          <Box sx={{
            fontSize: '5rem',
            mb: 2,
            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
              '100%': { transform: 'scale(1)' },
            },
          }}>
            {EMOTION_EMOJIS[displayEmotion] || DEFAULT_EMOJI}
          </Box>
          
          <Typography sx={{ 
            color: '#FFD700',
            fontSize: '28px',
            fontWeight: 600,
            textTransform: 'capitalize',
            mb: 1,
            letterSpacing: '0.5px',
          }}>
            {displayEmotion}
          </Typography>
          
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px',
            mb: 3,
          }}>
            {savedEmotion ? '저장된 감정 상태' : '분석된 감정 상태'}
          </Typography>
        </>
      )}

      {/* 다중 감정 표시 */}
      {emotions.length > 1 && (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1, 
          justifyContent: 'center',
          mt: 2 
        }}>
          {emotions.slice(0, 3).map((emotion, index) => (
            <Chip
              key={emotion.label}
              label={`${EMOTION_EMOJIS[emotion.label] || '🌟'} ${emotion.label}`}
              size="small"
              sx={{
                background: `rgba(255, 215, 0, ${0.3 - index * 0.1})`,
                color: '#FFD700',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                fontSize: '12px',
                fontWeight: 500,
                '&:hover': {
                  background: `rgba(255, 215, 0, ${0.4 - index * 0.1})`,
                },
              }}
            />
          ))}
        </Box>
      )}
    </GlassCard>
  )
}
