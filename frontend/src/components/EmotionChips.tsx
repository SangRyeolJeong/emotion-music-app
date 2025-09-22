import { Chip, Box, Typography, Fade } from '@mui/material'
import { EmotionPrediction } from '../api/analyze'

interface EmotionChipsProps {
  predictions: EmotionPrediction[]
  selectedEmotion: string | null
  onEmotionSelect: (emotion: string) => void
}

const emotionEmojis: Record<string, string> = {
  joy: '😊',
  love: '💖',
  excitement: '✨',
  gratitude: '🙏',
  optimism: '🌟',
  anger: '😤',
  sadness: '😢',
  fear: '😰',
  disgust: '😖',
  surprise: '😲',
  neutral: '😐',
  admiration: '🌟',
  amusement: '😄',
  annoyance: '😒',
  approval: '👍',
  caring: '🤗',
  confusion: '🤔',
  curiosity: '🧐',
  desire: '💫',
  disappointment: '😞',
  disapproval: '👎',
  embarrassment: '😳',
  grief: '😭',
  nervousness: '😅',
  pride: '😤',
  realization: '💡',
  relief: '😌',
  remorse: '😔',
}

const emotionColors: Record<string, { bg: string; border: string; text: string }> = {
  joy: { bg: 'rgba(255, 215, 0, 0.15)', border: '#FFD700', text: '#FFD700' },
  love: { bg: 'rgba(255, 105, 180, 0.15)', border: '#FF69B4', text: '#FF69B4' },
  excitement: { bg: 'rgba(255, 215, 0, 0.2)', border: '#FFD700', text: '#FFD700' },
  gratitude: { bg: 'rgba(255, 255, 255, 0.1)', border: '#FFFFFF', text: '#FFFFFF' },
  optimism: { bg: 'rgba(255, 215, 0, 0.1)', border: '#FFD700', text: '#FFD700' },
  anger: { bg: 'rgba(220, 20, 60, 0.15)', border: '#DC143C', text: '#DC143C' },
  sadness: { bg: 'rgba(70, 130, 180, 0.15)', border: '#4682B4', text: '#4682B4' },
  fear: { bg: 'rgba(139, 0, 139, 0.15)', border: '#8B008B', text: '#8B008B' },
  disgust: { bg: 'rgba(154, 205, 50, 0.15)', border: '#9ACD32', text: '#9ACD32' },
  surprise: { bg: 'rgba(255, 165, 0, 0.15)', border: '#FFA500', text: '#FFA500' },
  neutral: { bg: 'rgba(255, 255, 255, 0.05)', border: '#666666', text: '#CCCCCC' },
}

const getEmotionStyle = (emotion: string) => {
  return emotionColors[emotion] || { bg: 'rgba(255, 215, 0, 0.1)', border: '#FFD700', text: '#FFD700' }
}

export function EmotionChips({ predictions, selectedEmotion, onEmotionSelect }: EmotionChipsProps) {
  if (predictions.length === 0) {
    return null
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ mt: 3 }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            mb: 3,
            color: '#FFD700',
            fontWeight: 300,
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          🌙 감정의 달빛
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1.5,
          justifyContent: 'center',
          mb: 2,
        }}>
          {predictions.map((prediction, index) => {
            const style = getEmotionStyle(prediction.label)
            const emoji = emotionEmojis[prediction.label] || '💫'
            const isSelected = selectedEmotion === prediction.label
            
            return (
              <Fade in timeout={1000 + index * 200} key={prediction.label}>
                <Chip
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span style={{ fontSize: '14px' }}>{emoji}</span>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>
                        {prediction.label}
                      </span>
                      <span style={{ 
                        fontSize: '11px', 
                        opacity: 0.8,
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        marginLeft: '4px',
                      }}>
                        {(prediction.probability * 100).toFixed(0)}%
                      </span>
                    </Box>
                  }
                  onClick={() => onEmotionSelect(prediction.label)}
                  variant="outlined"
                  sx={{
                    background: isSelected 
                      ? `linear-gradient(45deg, ${style.bg}, ${style.bg}AA)` 
                      : style.bg,
                    borderColor: style.border,
                    color: isSelected ? '#000000' : style.text,
                    borderWidth: 2,
                    borderRadius: 8,
                    padding: '8px 4px',
                    height: 'auto',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected 
                      ? `0 0 20px ${style.border}40, 0 4px 15px rgba(0, 0, 0, 0.3)` 
                      : '0 2px 10px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      background: `linear-gradient(45deg, ${style.bg}, ${style.bg}CC)`,
                      boxShadow: `0 0 25px ${style.border}60, 0 6px 20px rgba(0, 0, 0, 0.4)`,
                      borderColor: style.border,
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                  }}
                />
              </Fade>
            )
          })}
        </Box>
        
        {selectedEmotion && (
          <Fade in timeout={500}>
            <Box sx={{ 
              textAlign: 'center',
              mt: 2,
              p: 2,
              borderRadius: 2,
              background: 'rgba(255, 215, 0, 0.05)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
            }}>
              <Typography variant="body2" sx={{ color: '#FFD700', fontSize: '13px' }}>
                ✨ 선택된 감정: <strong>{selectedEmotion}</strong> {emotionEmojis[selectedEmotion]}
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>
    </Fade>
  )
}
