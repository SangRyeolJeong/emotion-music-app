import { Box } from '@mui/material'
import { keyframes } from '@mui/system'

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(1deg); }
  66% { transform: translateY(-10px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`

const pulse = keyframes`
  0% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
  100% { opacity: 0.3; transform: scale(1); }
`

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`

export const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 50%, #0a0a0a 100%)',
        overflow: 'hidden',
      }}
    >
      {/* 떠다니는 파티클들 */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: 'radial-gradient(circle, #FFD700, transparent)',
            borderRadius: '50%',
            animation: `${float} ${4 + i}s ease-in-out infinite`,
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
      
      {/* 펄스 효과 */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={`pulse-${i}`}
          sx={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1), transparent 70%)',
            borderRadius: '50%',
            animation: `${pulse} ${6 + i * 2}s ease-in-out infinite`,
            right: `${10 + i * 20}%`,
            bottom: `${15 + i * 25}%`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
      
      {/* 쉬머 효과 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
          backgroundSize: '200px 100%',
          animation: `${shimmer} 3s ease-in-out infinite`,
        }}
      />
    </Box>
  )
}
