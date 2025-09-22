// 고급스러운 디자인 시스템
export const theme = {
  colors: {
    // Primary Gold Palette
    gold: {
      50: '#FFFEF7',
      100: '#FFFBEB', 
      200: '#FEF3C7',
      300: '#FDE68A',
      400: '#FACC15',
      500: '#FFD700',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F'
    },
    
    // Dark Palette
    dark: {
      50: '#F8F9FA',
      100: '#E9ECEF',
      200: '#DEE2E6',
      300: '#CED4DA',
      400: '#ADB5BD',
      500: '#6C757D',
      600: '#495057',
      700: '#343A40',
      800: '#212529',
      900: '#1A1A1A',
      950: '#0A0A0A'
    },
    
    // Accent Colors
    accent: {
      purple: '#8B5CF6',
      blue: '#3B82F6',
      green: '#10B981',
      pink: '#EC4899',
      orange: '#F97316'
    }
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    secondary: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #404040 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    goldGlass: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.1) 100%)',
  },
  
  shadows: {
    glow: '0 0 30px rgba(255, 215, 0, 0.3)',
    glowLarge: '0 0 60px rgba(255, 215, 0, 0.4)',
    soft: '0 4px 20px rgba(0, 0, 0, 0.15)',
    medium: '0 8px 30px rgba(0, 0, 0, 0.25)',
    large: '0 20px 60px rgba(0, 0, 0, 0.4)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  
  blur: {
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
  },
  
  animation: {
    slow: '3s ease-in-out',
    medium: '1.5s ease-in-out',
    fast: '0.75s ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
}

// 글래스모피즘 스타일
export const glassStyle = {
  background: theme.gradients.glass,
  backdropFilter: theme.blur.md,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  boxShadow: theme.shadows.glass,
}

// 골드 글래스 스타일
export const goldGlassStyle = {
  background: theme.gradients.goldGlass,
  backdropFilter: theme.blur.md,
  border: '1px solid rgba(255, 215, 0, 0.2)',
  borderRadius: '20px',
  boxShadow: theme.shadows.glow,
}

// 카드 스타일
export const cardStyle = {
  background: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: theme.blur.md,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  boxShadow: theme.shadows.medium,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows.large,
    border: '1px solid rgba(255, 215, 0, 0.3)',
  }
}

// 버튼 스타일
export const buttonStyles = {
  primary: {
    background: theme.gradients.primary,
    border: 'none',
    borderRadius: '50px',
    color: 'black',
    fontWeight: 600,
    boxShadow: theme.shadows.glow,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.glowLarge,
    }
  },
  
  ghost: {
    background: 'transparent',
    border: '2px solid rgba(255, 215, 0, 0.5)',
    borderRadius: '50px',
    color: '#FFD700',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: theme.gradients.goldGlass,
      border: '2px solid #FFD700',
      transform: 'translateY(-2px)',
    }
  }
}
