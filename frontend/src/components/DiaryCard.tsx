import React from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { Psychology as PsychologyIcon, Save as SaveIcon, MusicNote as MusicNoteIcon, AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material'
import { GlassCard } from './GlassCard'
import { GradientButton } from './GradientButton'

interface DiaryCardProps {
  diaryText: string
  onDiaryChange: (text: string) => void
  onSave: () => void
  onRecommend: () => void
  loading: boolean
  recommendLoading: boolean
  hasExistingMusic: boolean
  emotionsLength: number
}

export const DiaryCard = ({
  diaryText,
  onDiaryChange,
  onSave,
  onRecommend,
  loading,
  recommendLoading,
  hasExistingMusic,
  emotionsLength
}: DiaryCardProps) => {
  return (
    <GlassCard sx={{ p: 4, height: 'fit-content' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PsychologyIcon sx={{ color: '#FFD700', mr: 2, fontSize: '2rem' }} />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#FFD700',
            fontWeight: 600,
          }}
        >
          오늘의 기억
        </Typography>
      </Box>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.6)',
          mb: 3,
          fontSize: '14px',
        }}
      >
        마음속 이야기를 자유롭게 적어보세요 ✨
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={12}
        variant="outlined"
        placeholder="오늘 하루는 어떠셨나요? 솔직한 마음을 적어보세요..."
        value={diaryText}
        onChange={(e) => onDiaryChange(e.target.value)}
        sx={{
          mb: 4,
          '& .MuiOutlinedInput-root': {
            fontSize: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 215, 0, 0.3)',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFD700',
              borderWidth: '2px',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
            },
          },
          '& .MuiInputBase-input': {
            color: '#fff',
            lineHeight: 1.8,
            fontSize: '16px',
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(255, 255, 255, 0.4)',
            opacity: 1,
          },
        }}
      />

      {/* 액션 버튼들 */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <GradientButton
          onClick={onSave}
          loading={loading}
          icon={<SaveIcon />}
          sx={{ flex: 1 }}
        >
          저장하기
        </GradientButton>
        
        <GradientButton
          variant="ghost"
          onClick={onRecommend}
          loading={recommendLoading}
          disabled={emotionsLength === 0}
          icon={hasExistingMusic ? <MusicNoteIcon /> : <AutoAwesomeIcon />}
          sx={{ flex: 1 }}
        >
          {hasExistingMusic ? '음악 보기' : '음악 추천'}
        </GradientButton>
      </Box>
      
      {/* 글자 수 표시 */}
      <Box sx={{ 
        mt: 2, 
        textAlign: 'right',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '12px'
      }}>
        {diaryText.length} characters
      </Box>
    </GlassCard>
  )
}
