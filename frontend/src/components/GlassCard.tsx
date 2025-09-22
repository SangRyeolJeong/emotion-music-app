import React from 'react'
import { Box, BoxProps } from '@mui/material'
import { cardStyle, glassStyle, goldGlassStyle } from '../styles/theme'

interface GlassCardProps extends BoxProps {
  variant?: 'default' | 'glass' | 'gold'
  hoverable?: boolean
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({ 
  variant = 'default', 
  hoverable = true, 
  children, 
  sx, 
  ...props 
}, ref) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'glass':
        return glassStyle
      case 'gold':
        return goldGlassStyle
      default:
        return cardStyle
    }
  }

  return (
    <Box
      ref={ref}
      sx={{
        ...getVariantStyle(),
        ...(hoverable && {
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            ...getVariantStyle()['&:hover'],
          }
        }),
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  )
})

GlassCard.displayName = 'GlassCard'
