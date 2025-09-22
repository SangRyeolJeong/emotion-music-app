import { useState, useEffect, useRef } from 'react'
import { Box, Typography, Grid, Chip } from '@mui/material'
import { LibraryMusic as LibraryMusicIcon } from '@mui/icons-material'
import { getDiaries } from '../api/diaries'
import { EMOTION_EMOJIS, DEFAULT_EMOJI } from '../constants/emotions'
import { GlassCard } from '../components/GlassCard'
import { AnimatedBackground } from '../components/AnimatedBackground'
import { MusicCard } from '../components/MusicCard'

interface MusicRecommendation {
  date: string
  emotion: string
  tracks: {
    id: string
    name: string
    artists: string[]
    image_url?: string
    preview_url?: string
    external_urls?: { spotify?: string }
  }[]
}

const MusicHistory = () => {
  const [musicHistory, setMusicHistory] = useState<MusicRecommendation[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const loadMusicHistory = async () => {
      try {
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
          setMusicHistory([])
          return
        }

        const diaries = await getDiaries(parseInt(userId), 100)
        
        const musicRecommendations: MusicRecommendation[] = diaries
          .filter(diary => diary.music && diary.music.tracks && diary.music.tracks.length > 0)
          .map(diary => ({
            date: diary.date,
            emotion: diary.emotion || 'neutral',
            tracks: diary.music.tracks
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        setMusicHistory(musicRecommendations)
      } catch (error) {
        console.error('음악 히스토리 로딩 실패:', error)
        setMusicHistory([])
      }
    }

    loadMusicHistory()
  }, [])

  // 음악 재생/정지 함수
  const handlePlayPause = (track: any) => {
    if (!track.preview_url) {
      alert('이 곡은 미리듣기를 지원하지 않습니다.')
      return
    }

    if (currentlyPlaying === track.id) {
      // 현재 재생 중인 트랙을 정지
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setCurrentlyPlaying(null)
    } else {
      // 기존 오디오 정지
      if (audioRef.current) {
        audioRef.current.pause()
      }

      // 새 오디오 재생
      const audio = new Audio(track.preview_url)
      audio.play()
      audioRef.current = audio
      setCurrentlyPlaying(track.id)

      // 재생 완료 시 상태 초기화
      audio.onended = () => {
        setCurrentlyPlaying(null)
        audioRef.current = null
      }
    }
  }

  // Spotify에서 열기
  const handleOpenSpotify = (track: any) => {
    if (track.external_urls?.spotify) {
      window.open(track.external_urls.spotify, '_blank')
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      year: date.getFullYear(),
      month: String(date.getMonth() + 1).padStart(2, '0'),
      day: String(date.getDate()).padStart(2, '0'),
      dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
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
        minHeight: '100vh',
      }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <LibraryMusicIcon sx={{ 
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
              Music Archive
            </Typography>
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '18px',
              fontWeight: 300,
            }}
          >
            감정과 함께한 음악 여행의 기록 ✨
          </Typography>
        </Box>

        {/* 음악 기록 그리드 */}
        {musicHistory.length === 0 ? (
          <GlassCard sx={{ textAlign: 'center', py: 8 }}>
            <LibraryMusicIcon sx={{ 
              fontSize: '4rem', 
              color: 'rgba(255, 215, 0, 0.3)', 
              mb: 2,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-10px)' },
                '100%': { transform: 'translateY(0px)' },
              },
            }} />
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '18px',
              mb: 1,
            }}>
              아직 추천받은 음악이 없어요
            </Typography>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.4)', 
              fontSize: '14px',
            }}>
              일기를 작성하고 감정에 맞는 음악을 추천받아보세요 ✨
            </Typography>
          </GlassCard>
        ) : (
          <Grid container spacing={3}>
            {musicHistory.map((item, index) => {
              const dateInfo = formatDate(item.date)
              const emoji = EMOTION_EMOJIS[item.emotion] || DEFAULT_EMOJI
              
              return (
                <Grid item xs={12} key={index}>
                  <GlassCard sx={{ 
                    p: 3, 
                    mb: 2,
                    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                    '@keyframes slideInUp': {
                      '0%': {
                        opacity: 0,
                        transform: 'translateY(30px)',
                      },
                      '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}>
                    {/* 날짜 및 감정 헤더 */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 3,
                      pb: 2,
                      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                    }}>
                      <Typography sx={{ 
                        color: '#FFD700', 
                        fontSize: '20px', 
                        fontWeight: 600, 
                        mr: 3,
                        letterSpacing: '0.5px',
                      }}>
                        {dateInfo.year}.{dateInfo.month}.{dateInfo.day}
                      </Typography>
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        fontSize: '16px', 
                        mr: 3,
                      }}>
                        {dateInfo.dayOfWeek}요일
                      </Typography>
                      <Chip
                        icon={<span style={{ fontSize: '18px' }}>{emoji}</span>}
                        label={item.emotion}
                        sx={{
                          background: 'rgba(255, 215, 0, 0.15)',
                          color: '#FFD700',
                          border: '1px solid rgba(255, 215, 0, 0.3)',
                          fontSize: '14px',
                          fontWeight: 500,
                          textTransform: 'capitalize',
                          '&:hover': {
                            background: 'rgba(255, 215, 0, 0.25)',
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      />
                      <Box sx={{ ml: 'auto', color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                        {item.tracks.length}곡
                      </Box>
                    </Box>

                    {/* 앨범 그리드 */}
                    <Grid container spacing={2}>
                      {item.tracks.map((track, trackIndex) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={track.id}>
                          <MusicCard
                            track={track}
                            isPlaying={currentlyPlaying === track.id}
                            onPlayPause={handlePlayPause}
                            onOpenSpotify={handleOpenSpotify}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </GlassCard>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Box>
    </Box>
  )
}

export default MusicHistory
