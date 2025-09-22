import { Box, Card, CardMedia, CardContent, Typography, IconButton, Tooltip } from '@mui/material'
import { PlayArrow as PlayArrowIcon, Pause as PauseIcon, VolumeOff as VolumeOffIcon, OpenInNew as OpenInNewIcon, LibraryMusic as LibraryMusicIcon } from '@mui/icons-material'

interface Track {
  id: string
  name: string
  artists: string[] | string
  album?: string
  image_url?: string
  preview_url?: string
  external_urls?: { spotify?: string }
}

interface MusicCardProps {
  track: Track
  isPlaying: boolean
  onPlayPause: (track: Track) => void
  onOpenSpotify: (track: Track) => void
}

export const MusicCard = ({ track, isPlaying, onPlayPause, onOpenSpotify }: MusicCardProps) => {
  return (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.2)',
      },
    }}>
      {/* 앨범 아트 */}
      <Box sx={{ position: 'relative', aspectRatio: '1' }}>
        {track.image_url ? (
          <CardMedia
            component="img"
            image={track.image_url}
            alt={`${track.name} 앨범 커버`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box sx={{
            width: '100%',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <LibraryMusicIcon sx={{ color: 'rgba(255, 215, 0, 0.3)', fontSize: '3rem' }} />
          </Box>
        )}
        
        {/* 플레이 오버레이 */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          '&:hover': {
            opacity: 1,
          },
        }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title={track.preview_url ? "30초 미리듣기" : "미리듣기 지원 안함"}>
              <IconButton
                onClick={() => onPlayPause(track)}
                sx={{
                  color: track.preview_url ? '#FFD700' : '#666',
                  background: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 215, 0, 0.2)',
                    transform: 'scale(1.1)',
                    border: '1px solid rgba(255, 215, 0, 0.4)',
                  },
                }}
              >
                {!track.preview_url ? (
                  <VolumeOffIcon />
                ) : isPlaying ? (
                  <PauseIcon />
                ) : (
                  <PlayArrowIcon />
                )}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Spotify에서 전체 듣기">
              <IconButton
                onClick={() => onOpenSpotify(track)}
                sx={{
                  color: '#1DB954',
                  background: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(29, 185, 84, 0.2)',
                    transform: 'scale(1.1)',
                    border: '1px solid rgba(29, 185, 84, 0.4)',
                  },
                }}
              >
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* 트랙 정보 */}
      <CardContent sx={{ p: 2 }}>
        <Typography sx={{ 
          color: '#fff', 
          fontSize: '14px', 
          fontWeight: 600,
          mb: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {track.name}
        </Typography>
        <Typography sx={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          fontSize: '12px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {Array.isArray(track.artists) ? track.artists.join(', ') : track.artists}
        </Typography>
      </CardContent>
    </Card>
  )
}
