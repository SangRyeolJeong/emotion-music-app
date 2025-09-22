import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  Typography, 
  Button, 
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  TextField,
  CircularProgress
} from '@mui/material'
import { 
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  History as HistoryIcon,
  DeleteForever as DeleteIcon,
  ExitToApp as LogoutIcon,
  Info as InfoIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { changePassword } from '../api/auth'
import { GlassCard } from '../components/GlassCard'
import { AnimatedBackground } from '../components/AnimatedBackground'
import { GradientButton } from '../components/GradientButton'

export default function Settings() {
  const navigate = useNavigate()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // 비밀번호 변경 폼 상태
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // 로컬스토리지에서 사용자 정보 가져오기
  const username = localStorage.getItem('username') || '사용자'

  const handleLogout = () => {
    // 토큰 및 유저 정보 모두 삭제
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    // 전역 이벤트 디스패치로 App에 알림
    window.dispatchEvent(new Event('auth-changed'))
    setSuccess('로그아웃되었습니다.')
    setTimeout(() => {
      navigate('/login')
    }, 1000)
    setLogoutDialogOpen(false)
  }

  const handleDeleteAccount = () => {
    // TODO: 실제 계정 삭제 API 호출
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    window.dispatchEvent(new Event('auth-changed'))
    setSuccess('계정이 삭제되었습니다.')
    setTimeout(() => {
      navigate('/login')
    }, 1000)
    setDeleteDialogOpen(false)
  }

  const handleChangePassword = () => {
    setPasswordDialogOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    if (newPassword.length < 4) {
      setError('새 비밀번호는 최소 4자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await changePassword({
        username,
        current_password: currentPassword,
        new_password: newPassword
      })

      setSuccess('비밀번호가 성공적으로 변경되었습니다.')
      setPasswordDialogOpen(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.response?.data?.detail || '비밀번호 변경 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
  }

  const handleDataClear = () => {
    // TODO: 사용자 데이터 초기화
    setSuccess('데이터가 초기화되었습니다.')
  }

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
            <IconButton 
              onClick={() => navigate('/')}
              sx={{ 
                position: 'absolute',
                left: 0,
                color: '#FFD700',
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
            
            <SettingsIcon sx={{ 
              color: '#FFD700', 
              fontSize: '3rem', 
              mr: 2,
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
              animation: 'spin 8s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
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
              Settings
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
            계정 및 앱 설정 관리 ⚙️
          </Typography>
        </Box>

        {/* 사용자 정보 */}
        <GlassCard sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          <Box sx={{ 
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
              '100%': { transform: 'translateY(0px)' },
            },
          }}>
            <PersonIcon sx={{ color: '#000', fontSize: '40px' }} />
          </Box>
          <Typography sx={{ 
            color: '#fff', 
            fontSize: '24px', 
            fontWeight: 600,
            mb: 1,
          }}>
            {username}
          </Typography>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '16px',
          }}>
            감정일기 사용자 ✨
          </Typography>
        </GlassCard>

        {/* 설정 메뉴 */}
        <GlassCard sx={{ mb: 4, overflow: 'hidden' }}>
        <List sx={{ p: 0 }}>
          <ListItemButton 
            onClick={handleChangePassword}
            sx={{
              py: 3,
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                transform: 'translateX(8px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon>
              <LockIcon sx={{ color: '#FFD700' }} />
            </ListItemIcon>
            <ListItemText 
              primary="비밀번호 변경"
              primaryTypographyProps={{ 
                color: '#fff',
                fontSize: '16px'
              }}
            />
          </ListItemButton>
          
          <Divider sx={{ backgroundColor: '#333' }} />
          
          <ListItemButton 
            onClick={handleDataClear}
            sx={{
              py: 3,
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                transform: 'translateX(8px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon>
              <HistoryIcon sx={{ color: '#FFD700' }} />
            </ListItemIcon>
            <ListItemText 
              primary="데이터 초기화"
              secondary="모든 일기와 음악 기록이 삭제됩니다"
              primaryTypographyProps={{ 
                color: '#fff',
                fontSize: '16px'
              }}
              secondaryTypographyProps={{ 
                color: '#888',
                fontSize: '12px'
              }}
            />
          </ListItemButton>
          
          <Divider sx={{ backgroundColor: '#333' }} />
          
          <ListItemButton 
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              py: 3,
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                transform: 'translateX(8px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <ListItemIcon>
              <DeleteIcon sx={{ color: '#ff4444' }} />
            </ListItemIcon>
            <ListItemText 
              primary="계정 삭제"
              secondary="계정과 모든 데이터가 영구적으로 삭제됩니다"
              primaryTypographyProps={{ 
                color: '#ff4444',
                fontSize: '16px'
              }}
              secondaryTypographyProps={{ 
                color: '#888',
                fontSize: '12px'
              }}
            />
          </ListItemButton>
        </List>
        </GlassCard>

        {/* 앱 정보 */}
        <GlassCard sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon sx={{ color: '#FFD700', mr: 2 }} />
          <Typography sx={{ color: '#FFD700', fontSize: '16px', fontWeight: 500 }}>
            앱 정보
          </Typography>
        </Box>
        <Typography sx={{ color: '#888', fontSize: '14px', mb: 1 }}>
          감정일기 v1.0.0
        </Typography>
        <Typography sx={{ color: '#888', fontSize: '12px' }}>
          당신의 감정에 맞는 음악을 추천하는 일기 앱입니다.
        </Typography>
        </GlassCard>

        {/* 로그아웃 버튼 */}
        <GradientButton
          fullWidth
          onClick={() => setLogoutDialogOpen(true)}
          icon={<LogoutIcon />}
          sx={{ mt: 4 }}
        >
          로그아웃
        </GradientButton>

        {/* 비밀번호 변경 다이얼로그 */}
        <Dialog
          open={passwordDialogOpen}
          onClose={handlePasswordDialogClose}
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
            🔒 비밀번호 변경
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="현재 비밀번호"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFD700',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#FFD700',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                }}
              />
              
              <TextField
                label="새 비밀번호"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFD700',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#FFD700',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                }}
              />
              
              <TextField
                label="새 비밀번호 확인"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FFD700',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#FFD700',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                }}
              />
              
              {error && (
                <Alert severity="error" sx={{ borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, borderTop: '1px solid #333' }}>
            <Button 
              onClick={handlePasswordDialogClose}
              sx={{ 
                color: '#888',
                borderRadius: '20px',
                px: 3,
              }}
            >
              취소
            </Button>
            <GradientButton
              onClick={handlePasswordSubmit}
              loading={loading}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              변경
            </GradientButton>
          </DialogActions>
        </Dialog>

      {/* 로그아웃 확인 다이얼로그 */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFD700' }}>
          로그아웃
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#fff' }}>
            정말 로그아웃하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setLogoutDialogOpen(false)}
            sx={{ color: '#888' }}
          >
            취소
          </Button>
          <Button 
            onClick={handleLogout}
            sx={{ color: '#FFD700' }}
          >
            로그아웃
          </Button>
        </DialogActions>
      </Dialog>

      {/* 계정 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
          }
        }}
      >
        <DialogTitle sx={{ color: '#ff4444' }}>
          계정 삭제
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#fff' }}>
            정말 계정을 삭제하시겠습니까?<br/>
            <strong style={{ color: '#ff4444' }}>이 작업은 되돌릴 수 없습니다.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: '#888' }}
          >
            취소
          </Button>
          <Button 
            onClick={handleDeleteAccount}
            sx={{ color: '#ff4444' }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      {/* 성공 메시지 */}
      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            position: 'fixed',
            bottom: '100px',
            left: '20px',
            right: '20px',
            borderRadius: '15px',
            zIndex: 1000,
          }}
        >
          {success}
        </Alert>
      )}

      {/* 에러 메시지 */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'fixed',
            bottom: '100px',
            left: '20px',
            right: '20px',
            borderRadius: '15px',
            zIndex: 1000,
          }}
        >
          {error}
        </Alert>
      )}
      </Box>
    </Box>
  )
}
