import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  IconButton, 
  Box,
  Link,
  Fade,
} from '@mui/material'
import { PlayArrow, OpenInNew, MusicNote } from '@mui/icons-material'
import { TrackInfo } from '../api/recommend'

interface TrackCardProps {
  track: TrackInfo
  onPlay?: (url: string) => void
}

export function TrackCard({ track, onPlay }: TrackCardProps) {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card sx={{ 
      display: 'flex', 
      height: 160,
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(16,16,16,0.9) 100%)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      borderRadius: 3,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px) scale(1.02)',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        boxShadow: '0 8px 30px rgba(255, 215, 0, 0.2), 0 0 0 1px rgba(255, 215, 0, 0.1)',
        '& .track-image': {
          transform: 'scale(1.1)',
        },
        '& .play-button': {
          opacity: 1,
          transform: 'scale(1)',
        },
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, transparent 50%, rgba(255, 255, 255, 0.01) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }
    }}>
      <Box sx={{ position: 'relative', width: 160, height: 160, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          className="track-image"
          sx={{ 
            width: 160, 
            height: 160,
            transition: 'transform 0.3s ease',
            filter: track.album_image ? 'none' : 'grayscale(1)',
          }}
          image={track.album_image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMUExQTFBIi8+CjxwYXRoIGQ9Ik04MCA0MEMyNi44NjI5IDQwIDQwIDUzLjEzNzEgNDAgODBDNDAgMTA2Ljg2MyA1My4xMzcxIDEyMCA4MCAxMjBDMTA2Ljg2MyAxMjAgMTIwIDEwNi44NjMgMTIwIDgwQzEyMCA1My4xMzcxIDEwNi44NjMgNDAgODAgNDBaTTgwIDEwMEM2NC41MzEyIDEwMCA2MCA5NS40Njg4IDYwIDgwQzYwIDY0LjUzMTIgNjQuNTMxMiA2MCA4MCA2MEM5NS40Njg4IDYwIDEwMCA2NC41MzEyIDEwMCA4MEMxMDAgOTUuNDY4OCA5NS40Njg4IDEwMCA4MCAxMDBaIiBmaWxsPSIjRkZENzAwIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4K'}
          alt={track.name}
        />
        
        {track.preview_url && (
          <IconButton 
            className="play-button"
            aria-label="play"
            onClick={() => onPlay?.(track.preview_url!)}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) scale(0.8)',
              opacity: 0,
              transition: 'all 0.3s ease',
              background: 'rgba(255, 215, 0, 0.9)',
              color: '#000000',
              width: 56,
              height: 56,
              '&:hover': {
                background: 'rgba(255, 215, 0, 1)',
                transform: 'translate(-50%, -50%) scale(1.1)',
              },
            }}
          >
            <PlayArrow sx={{ fontSize: 32 }} />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 2 }}>
        <CardContent sx={{ flex: '1 0 auto', pb: 1, px: 2, py: 2 }}>
          <Typography 
            component="div" 
            variant="h6" 
            noWrap
            sx={{ 
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '16px',
              mb: 0.5,
              lineHeight: 1.3,
            }}
          >
            {track.name}
          </Typography>
          <Typography 
            variant="subtitle1" 
            noWrap
            sx={{ 
              color: '#FFD700',
              fontSize: '14px',
              fontWeight: 400,
              mb: 1,
            }}
          >
            {track.artists}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              ⏱️ {formatDuration(track.duration_ms)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              🔥 {track.popularity}/100
            </Typography>
          </Box>
        </CardContent>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          px: 2, 
          pb: 2,
        }}>
          <Link
            href={track.external_url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: 'none' }}
          >
            <IconButton 
              aria-label="open in spotify"
              sx={{
                color: '#FFD700',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#FFEB3B',
                  transform: 'scale(1.1)',
                  background: 'rgba(255, 215, 0, 0.1)',
                },
              }}
            >
              <OpenInNew fontSize="small" />
            </IconButton>
          </Link>
        </Box>
      </Box>
    </Card>
  )
}
