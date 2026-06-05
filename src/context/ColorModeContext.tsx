import { createContext, useContext, useState, useMemo, type PropsWithChildren } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

type ColorMode = 'light' | 'dark'

interface ColorModeContextValue {
  mode: ColorMode
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleColorMode: () => {},
})

export function useColorMode() {
  return useContext(ColorModeContext)
}

function buildTheme(mode: ColorMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
        contrastText: '#ffffff',
      },
      ...(mode === 'dark' && {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 500 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'dark'
              ? '0 2px 8px rgba(0,0,0,0.4)'
              : '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          },
        },
      },
    },
  })
}

const STORAGE_KEY = 'ams-color-mode'

export function ColorModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ColorMode>(
    () => (localStorage.getItem(STORAGE_KEY) as ColorMode | null) ?? 'light'
  )

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  const theme = useMemo(() => buildTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
