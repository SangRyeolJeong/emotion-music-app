import { Button, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { Create, History } from '@mui/icons-material'

export function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        startIcon={<Create />}
        onClick={() => navigate('/')}
        sx={{
          color: isActive('/') ? '#000000' : '#FFD700',
          background: isActive('/') 
            ? 'linear-gradient(45deg, #FFD700 0%, #FFEB3B 100%)' 
            : 'transparent',
          border: isActive('/') ? 'none' : '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 3,
          px: 2.5,
          py: 1,
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: isActive('/') 
              ? 'linear-gradient(45deg, #FFEB3B 0%, #FFD700 100%)'
              : 'rgba(255, 215, 0, 0.1)',
            borderColor: '#FFD700',
            transform: 'translateY(-1px)',
          },
        }}
      >
        ✍️ 일기 작성
      </Button>
      <Button
        startIcon={<History />}
        onClick={() => navigate('/history')}
        sx={{
          color: isActive('/history') ? '#000000' : '#FFD700',
          background: isActive('/history') 
            ? 'linear-gradient(45deg, #FFD700 0%, #FFEB3B 100%)' 
            : 'transparent',
          border: isActive('/history') ? 'none' : '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: 3,
          px: 2.5,
          py: 1,
          fontWeight: 500,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: isActive('/history') 
              ? 'linear-gradient(45deg, #FFEB3B 0%, #FFD700 100%)'
              : 'rgba(255, 215, 0, 0.1)',
            borderColor: '#FFD700',
            transform: 'translateY(-1px)',
          },
        }}
      >
        📊 히스토리
      </Button>
    </Box>
  )
}
