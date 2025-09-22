import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, IconButton, Tooltip } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import { glassStyle } from '../styles/theme'

export const BottomNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const getCurrentValue = () => {
    if (location.pathname === '/') return 0
    if (location.pathname.startsWith('/diary')) return 0 // 일기 작성도 캘린더 탭
    if (location.pathname === '/music') return 1
    if (location.pathname === '/stats') return 2
    if (location.pathname === '/settings') return 3
    return 0
  }

  const [value, setValue] = useState(getCurrentValue())

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue)
    switch (newValue) {
      case 0:
        navigate('/')
        break
      case 1:
        navigate('/music')
        break
      case 2:
        navigate('/stats')
        break
      case 3:
        navigate('/settings')
        break
    }
  }

  const navItems = [
    { icon: CalendarMonthIcon, label: '캘린더', path: '/' },
    { icon: LibraryMusicIcon, label: '음악', path: '/music' },
    { icon: BarChartIcon, label: '감정통계', path: '/stats' },
    { icon: SettingsIcon, label: '설정', path: '/settings' },
  ]

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
    }}>
      <Box sx={{
        ...glassStyle,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: '60px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.2)',
      }}>
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = getCurrentValue() === index
          
          return (
            <Tooltip key={item.path} title={item.label} placement="top">
              <Box>
                  <IconButton
                  onClick={() => handleChange(null, index)}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    ...(isActive ? {
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: 'black',
                      boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                      transform: 'translateY(-4px)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        borderRadius: '50%',
                        zIndex: -1,
                        opacity: 0.3,
                        filter: 'blur(8px)',
                      }
                    } : {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&:hover': {
                        background: 'rgba(255, 215, 0, 0.1)',
                        color: '#FFD700',
                        transform: 'translateY(-2px)',
                      }
                    }),
                  }}
                >
                    <Icon fontSize="medium" />
                  </IconButton>
                </Box>
            </Tooltip>
          )
        })}
      </Box>
    </Box>
  )
}
