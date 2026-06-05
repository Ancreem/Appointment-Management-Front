import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AuthProvider } from '@/context/AuthContext'
import { AppRouter } from '@/routes/AppRouter'
import { theme } from '@/theme/theme'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element with id "root" not found in index.html')
}

createRoot(container).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </BrowserRouter>
)
