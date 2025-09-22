import { Button, ButtonProps, CircularProgress } from '@mui/material'
import { buttonStyles } from '../styles/theme'

interface GradientButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'ghost'
  loading?: boolean
  icon?: React.ReactNode
}

export const GradientButton = ({ 
  variant = 'primary', 
  loading = false,
  icon,
  children, 
  sx, 
  disabled,
  ...props 
}: GradientButtonProps) => {
  const isDisabled = disabled || loading

  return (
    <Button
      sx={{
        ...buttonStyles[variant],
        ...(isDisabled && {
          opacity: 0.6,
          cursor: 'not-allowed',
          '&:hover': {
            transform: 'none',
          }
        }),
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 3,
        py: 1.5,
        minHeight: '48px',
        ...sx
      }}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <CircularProgress 
          size={20} 
          sx={{ 
            color: variant === 'primary' ? 'black' : '#FFD700' 
          }} 
        />
      ) : icon}
      {children}
    </Button>
  )
}
