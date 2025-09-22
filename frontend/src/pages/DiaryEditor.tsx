import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Box, 
  TextField, 
  Typography, 
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Fade,
  Grid
} from '@mui/material'
import { 
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'
import { analyzeEmotion } from '../api/analyze'
import { getRecommendations, TrackInfo } from '../api/recommend'
import { createDiary, getDiaries, DiaryResponse } from '../api/diaries'
import { getUserInfo } from '../api/auth'
import { useDiaryStore } from '../store/useDiaryStore'
import { AnimatedBackground } from '../components/AnimatedBackground'
import { MusicCard } from '../components/MusicCard'
import { GlassCard } from '../components/GlassCard'

interface Emotion {
  label: string
  probability: number
}

// 추천 결과 타입은 API 스키마를 그대로 사용

import { EMOTION_EMOJIS, DEFAULT_EMOJI } from '../constants/emotions'

export default function DiaryEditor() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const [diaryText, setDiaryText] = useState('')
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [recommendations, setRecommendations] = useState<TrackInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [recommendLoading, setRecommendLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [savedEmotion, setSavedEmotion] = useState<string | null>(null)
  
  // 음악 재생 관련 상태
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // 모달 상태
  const [musicModalOpen, setMusicModalOpen] = useState(false)
  const [hasExistingMusic, setHasExistingMusic] = useState(false)
  
  const { upsertDiary } = useDiaryStore()

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    // YYYY-MM-DD 문자열을 로컬 날짜로 해석
    const [y, m, d] = dateString.split('-').map(Number)
    const date = new Date(y, (m || 1) - 1, d || 1)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
    }
  }

  const dateInfo = date ? formatDate(date) : null

  // 선택한 날짜의 기존 일기를 불러와서 편집기에 표시
  useEffect(() => {
    const load = async () => {
      try {
        // 1) 캐시된 user_id 우선 사용, 없을 때만 조회
        let userId: string | null = localStorage.getItem('user_id')
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
        if (!userId) return
        const list = await getDiaries(parseInt(userId), 62)
        const exist = list.find((d) => d.date === date)
        if (exist) {
          setDiaryText(exist.content)
          if (exist.emotion) {
            setSavedEmotion(exist.emotion)
            setEmotions([{ label: exist.emotion, probability: 1 }])
          }
          // 저장된 음악 추천도 로드
          if (exist.music && exist.music.tracks && exist.music.tracks.length > 0) {
            setRecommendations(exist.music.tracks)
            setHasExistingMusic(true)
          } else {
            setHasExistingMusic(false)
          }
        } else {
          setHasExistingMusic(false)
        }
      } catch {
        // ignore
      }
    }
    if (date) {
      load()
    }
  }, [date])

  const handleSave = async () => {
    if (!diaryText.trim()) {
      setError('일기 내용을 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // 1. 감정 분석
      const emotionResult = await analyzeEmotion({ text: diaryText })
      const topEmotion = emotionResult.predictions[0]
      
      // 2. 일기 저장
      const diary = {
        content: diaryText,
        emotion: topEmotion.label,
        date: date,
      }
      
      // 저장 시에도 캐시된 user_id 사용, 없으면 1회 조회
      let ensuredUserIdStr: string | null = localStorage.getItem('user_id')
      if (!ensuredUserIdStr) {
        const username = localStorage.getItem('username')
        if (username) {
          const user = await getUserInfo(username)
          ensuredUserIdStr = String(user.id)
          localStorage.setItem('user_id', ensuredUserIdStr)
        }
      }
      if (!ensuredUserIdStr) throw new Error('No user available')
      const saved: DiaryResponse = await createDiary(diary, parseInt(ensuredUserIdStr))
      upsertDiary(saved)
      // 저장 후 에디터 상태 동기화
      setDiaryText(saved.content)
      if (saved.emotion) {
        setSavedEmotion(saved.emotion)
        setEmotions([{ label: saved.emotion, probability: 1 }])
      }
      
      setEmotions(emotionResult.predictions)
      setSavedEmotion(topEmotion.label)
      setSuccess('일기가 저장되었습니다!')
      
    } catch (err) {
      setError('일기 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleRecommend = async () => {
    if (emotions.length === 0) {
      setError('먼저 일기를 저장해서 감정을 분석해주세요.')
      return
    }

    setRecommendLoading(true)
    setError(null)
    
    try {
      const result = await getRecommendations({
        selected: emotions.slice(0, 3), // 상위 3개 감정 사용
        limit: 4
      })
      setRecommendations(result.tracks)
      
      // 음악 추천 결과를 일기에 저장
      const userId = localStorage.getItem('user_id')
      if (userId && date) {
        const musicData = {
          tracks: result.tracks,
          target: result.target,
          emotions: emotions.slice(0, 3),
          recommendedAt: new Date().toISOString()
        }
        
        // 현재 일기 내용과 함께 음악 정보 저장
        const diary = {
          content: diaryText,
          emotion: savedEmotion || undefined,
          music: musicData,
          date: date,
        }
        
        const updatedDiary = await createDiary(diary, parseInt(userId))
        upsertDiary(updatedDiary)
        setHasExistingMusic(true)
        setSuccess(`${result.tracks.length}개의 추천곡을 찾아서 저장했습니다!`)
      } else {
        setSuccess(`${result.tracks.length}개의 추천곡을 찾았습니다!`)
      }
      
      // 모달 열기
      setMusicModalOpen(true)
    } catch (err) {
      setError('음악 추천 중 오류가 발생했습니다.')
    } finally {
      setRecommendLoading(false)
    }
  }

  const handleShowMusic = () => {
    setMusicModalOpen(true)
  }

  const handleCloseModal = () => {
    setMusicModalOpen(false)
  }

  // 음악 재생/정지 함수
  const handlePlayPause = (track: any) => {
    if (!track.preview_url) {
      setError('이 곡은 미리듣기를 지원하지 않습니다. Spotify에서 모든 곡에 대해 30초 샘플을 제공하지는 않습니다.')
      return
    }

    // 현재 재생 중인 곡과 같은 곡인지 확인
    if (currentlyPlaying === track.id) {
      // 재생 중이면 정지
      if (audioRef.current) {
        audioRef.current.pause()
        setCurrentlyPlaying(null)
      }
    } else {
      // 다른 곡이거나 정지 상태면 재생
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      const audio = new Audio(track.preview_url)
      audioRef.current = audio
      
      audio.addEventListener('ended', () => {
        setCurrentlyPlaying(null)
      })
      
      audio.addEventListener('error', () => {
        setError('음악 재생 중 오류가 발생했습니다.')
        setCurrentlyPlaying(null)
      })
      
      audio.play().then(() => {
        setCurrentlyPlaying(track.id)
      }).catch(() => {
        setError('음악 재생에 실패했습니다.')
        setCurrentlyPlaying(null)
      })
    }
  }

  // Spotify에서 듣기 함수
  const handleOpenSpotify = (track: any) => {
    const spotifyUrl = track.external_urls?.spotify
    if (spotifyUrl) {
      window.open(spotifyUrl, '_blank')
    } else {
      setError('Spotify 링크를 찾을 수 없습니다.')
    }
  }

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

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
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          mt: 1,
        }}>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              color: '#FFD700', 
              mr: 2,
              background: 'rgba(255, 215, 0, 0.1)',
              '&:hover': {
                background: 'rgba(255, 215, 0, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box>
            {dateInfo && (
              <>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {dateInfo.year}.{dateInfo.month}.{dateInfo.day}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '16px',
                  }}
                >
                  {dateInfo.dayOfWeek}요일의 기억
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* 감정 표시 */}
        {savedEmotion && (
          <GlassCard sx={{ textAlign: 'center', mb: 3, p: 2.5 }}>
            <Box sx={{
              fontSize: '50px',
              mb: 1.5,
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))',
              animation: 'emotion-float 3s ease-in-out infinite',
              '@keyframes emotion-float': {
                '0%': { transform: 'translateY(0px) scale(1)' },
                '50%': { transform: 'translateY(-6px) scale(1.03)' },
                '100%': { transform: 'translateY(0px) scale(1)' },
              },
            }}>
              {EMOTION_EMOJIS[savedEmotion] || DEFAULT_EMOJI}
            </Box>
            <Typography sx={{ 
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontSize: '18px',
              fontWeight: 500,
              textTransform: 'capitalize',
              letterSpacing: '0.5px',
            }}>
              {savedEmotion}
            </Typography>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '13px',
              mt: 0.5,
            }}>
              오늘의 주요 감정
            </Typography>
          </GlassCard>
        )}

        {/* 일기 제목 */}
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#fff',
            mb: 2,
            fontWeight: 300,
          }}
        >
          오늘의 기억
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            color: '#888',
            mb: 2,
            fontSize: '14px',
          }}
        >
          글자 수에 따라 달의 위치가 높아져요
        </Typography>

      {/* 일기 입력 */}
      <TextField
        fullWidth
        multiline
        rows={12}
        variant="outlined"
        placeholder="오늘 하루는 어떠셨나요?"
        value={diaryText}
        onChange={(e) => setDiaryText(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            fontSize: '16px',
            lineHeight: 1.6,
            color: '#FFFFFF',
            backgroundColor: 'rgba(26, 26, 26, 0.5)',
            borderRadius: '15px',
            '& fieldset': {
              borderColor: '#333',
            },
            '&:hover fieldset': {
              borderColor: '#FFD700',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFD700',
            },
          },
        }}
      />

      {/* 버튼들 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            background: 'linear-gradient(45deg, #FFD700 0%, #FFEB3B 100%)',
            color: '#000',
            borderRadius: '25px',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(45deg, #FFEB3B 0%, #FFD700 100%)',
              boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : '저장'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={hasExistingMusic ? handleShowMusic : handleRecommend}
          disabled={recommendLoading || emotions.length === 0}
          sx={{
            flex: 1,
            py: 1.5,
            borderColor: '#FFD700',
            color: '#FFD700',
            borderRadius: '25px',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#FFEB3B',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
            },
          }}
        >
          {recommendLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : hasExistingMusic ? (
            '추천 음악 보기'
          ) : (
            '음악 추천'
          )}
        </Button>
      </Box>

      {/* 알림 메시지 */}
      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 2, borderRadius: '15px' }}>
            {error}
          </Alert>
        </Fade>
      )}

      {success && (
        <Fade in={!!success}>
          <Alert severity="success" sx={{ mb: 2, borderRadius: '15px' }}>
            {success}
          </Alert>
        </Fade>
      )}

      {/* 음악 추천 모달 */}
      <Dialog
        open={musicModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '15px',
            color: '#fff',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#FFD700', 
          textAlign: 'center',
          borderBottom: '1px solid #333',
          pb: 2
        }}>
          🎵 추천된 음악 ({recommendations.length}곡)
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {recommendations.map((track) => (
              <Grid item xs={6} sm={6} md={6} lg={6} key={track.id}>
                <MusicCard
                  track={track}
                  isPlaying={currentlyPlaying === track.id}
                  onPlayPause={handlePlayPause}
                  onOpenSpotify={handleOpenSpotify}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          justifyContent: 'space-between', 
          px: 3, 
          pb: 3,
          borderTop: '1px solid #333',
          pt: 2
        }}>
          <Button
            onClick={handleRecommend}
            disabled={recommendLoading}
            sx={{
              color: '#FFD700',
              border: '1px solid #FFD700',
              borderRadius: '20px',
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
              },
            }}
          >
            {recommendLoading ? <CircularProgress size={20} color="inherit" /> : '새로운 추천받기'}
          </Button>
          
          <Button
            onClick={handleCloseModal}
            sx={{
              color: '#888',
              border: '1px solid #666',
              borderRadius: '20px',
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  )
}