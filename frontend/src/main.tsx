import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // 달빛 황금색
      light: '#FFEB3B',
      dark: '#FFC107',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FFFFFF', // 순백색
      light: '#F5F5F5',
      dark: '#E0E0E0',
      contrastText: '#000000',
    },
    background: {
      default: '#0A0A0A', // 깊은 밤하늘
      paper: '#1A1A1A', // 어두운 종이
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFD700',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
    h4: {
      fontWeight: 300,
      letterSpacing: '0.02em',
    },
    h5: {
      fontWeight: 400,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #333333',
          backgroundImage: 'linear-gradient(145deg, #1A1A1A 0%, #0F0F0F 100%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 15,
            '& fieldset': {
              borderColor: '#333333',
            },
            '&:hover fieldset': {
              borderColor: '#FFD700',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFD700',
            },
          },
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
