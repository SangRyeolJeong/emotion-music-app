import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  TextField, 
  Typography, 
  Alert,
  Tabs,
  Tab
} from '@mui/material'
import { PersonAdd, Login as LoginIcon } from '@mui/icons-material'
import { login, register } from '../api/auth'
import { GlassCard } from '../components/GlassCard'
import { GradientButton } from '../components/GradientButton'
import { AnimatedBackground } from '../components/AnimatedBackground'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // 로그인 폼
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  })
  
  // 회원가입 폼
  const [signupForm, setSignupForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setError(null)
    setSuccess(null)
  }

  const handleLogin = async () => {
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setError('사용자명과 비밀번호를 입력해주세요.')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // 실제 로그인 API 호출
      const response = await login({
        username: loginForm.username,
        password: loginForm.password
      })
      
      // 로그인 성공 시 토큰과 사용자 정보 저장
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('username', response.user.username)
      localStorage.setItem('user_id', response.user.id.toString())
      // 앱 전역에 로그인 상태 변경 알림
      window.dispatchEvent(new Event('auth-changed'))
      
      navigate('/')
      
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('사용자명 또는 비밀번호가 잘못되었습니다.')
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    if (!signupForm.username.trim() || !signupForm.password.trim()) {
      setError('모든 필드를 입력해주세요.')
      return
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    
    if (signupForm.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // 실제 회원가입 API 호출
      await register({
        username: signupForm.username,
        password: signupForm.password
      })
      
      setSuccess('회원가입이 완료되었습니다! 로그인해주세요.')
      setTabValue(0) // 로그인 탭으로 전환
      setSignupForm({ username: '', password: '', confirmPassword: '' })
      
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('이미 존재하는 사용자명입니다.')
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <AnimatedBackground />
      
      <GlassCard 
        variant="gold"
        sx={{
          width: '100%',
          maxWidth: '450px',
          p: 5,
          mx: 2,
          position: 'relative',
          animation: 'zoomIn 0.5s ease-out',
          '@keyframes zoomIn': {
            '0%': {
              opacity: 0,
              transform: 'scale(0.3)',
            },
            '50%': {
              opacity: 1,
            },
            '100%': {
              opacity: 1,
              transform: 'scale(1)',
            },
          },
        }}
      >
          {/* 로고/제목 */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box sx={{ 
              mb: 2,
              fontSize: '4rem',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))',
            }}>
              🌙
            </Box>
            <Typography 
              variant="h3" 
              sx={{ 
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 300,
                mb: 1,
                letterSpacing: '0.05em',
              }}
            >
              감정일기
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '16px',
                lineHeight: 1.6,
              }}
            >
              당신의 감정에 맞는 음악을 추천해드려요
            </Typography>
          </Box>

          {/* 탭 */}
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              centered
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  height: '3px',
                  borderRadius: '3px',
                },
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '18px',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  margin: '0 8px',
                  transition: 'all 0.3s ease',
                  minHeight: '48px',
                  '&.Mui-selected': {
                    color: '#FFD700',
                    background: 'rgba(255, 215, 0, 0.1)',
                  },
                  '&:hover': {
                    background: 'rgba(255, 215, 0, 0.05)',
                  }
                },
              }}
            >
              <Tab label="로그인" value={0} />
              <Tab label="회원가입" value={1} />
            </Tabs>
          </Box>

      {/* 로그인 폼 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="사용자명"
            variant="outlined"
            value={loginForm.username}
            onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 215, 0, 0.5)',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                  borderWidth: '2px',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
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
                fontSize: '16px',
                padding: '16px 14px',
              },
            }}
          />
          
          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            variant="outlined"
            value={loginForm.password}
            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: '1px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 215, 0, 0.5)',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFD700',
                  borderWidth: '2px',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
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
                fontSize: '16px',
                padding: '16px 14px',
              },
            }}
          />
          
          <GradientButton
            fullWidth
            onClick={handleLogin}
            loading={loading}
            icon={<LoginIcon />}
            sx={{ mt: 2 }}
          >
            로그인
          </GradientButton>
        </Box>
      </TabPanel>

      {/* 회원가입 폼 */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="사용자명"
            variant="outlined"
            value={signupForm.username}
            onChange={(e) => setSignupForm(prev => ({ ...prev, username: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(26, 26, 26, 0.7)',
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
              '& .MuiInputLabel-root': {
                color: '#888',
              },
              '& .MuiInputBase-input': {
                color: '#fff',
              },
            }}
          />
          
          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            variant="outlined"
            value={signupForm.password}
            onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(26, 26, 26, 0.7)',
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
              '& .MuiInputLabel-root': {
                color: '#888',
              },
              '& .MuiInputBase-input': {
                color: '#fff',
              },
            }}
          />
          
          <TextField
            fullWidth
            label="비밀번호 확인"
            type="password"
            variant="outlined"
            value={signupForm.confirmPassword}
            onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(26, 26, 26, 0.7)',
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
              '& .MuiInputLabel-root': {
                color: '#888',
              },
              '& .MuiInputBase-input': {
                color: '#fff',
              },
            }}
          />
          
          <GradientButton
            fullWidth
            onClick={handleSignup}
            loading={loading}
            icon={<PersonAdd />}
            sx={{ mt: 2 }}
          >
            회원가입
          </GradientButton>
        </Box>
      </TabPanel>

          {/* 알림 메시지 */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: 3, 
                borderRadius: '16px',
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                color: '#ff6b6b',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b',
                }
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mt: 3, 
                borderRadius: '16px',
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                color: '#4caf50',
                '& .MuiAlert-icon': {
                  color: '#4caf50',
                }
              }}
            >
              {success}
            </Alert>
          )}
      </GlassCard>
    </Box>
  )
}
