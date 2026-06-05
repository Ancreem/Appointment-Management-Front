import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ColorModeProvider } from '@/context/ColorModeContext'
import { AuthProvider } from '@/context/AuthContext'
import { AppRouter } from '@/routes/AppRouter'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element with id "root" not found in index.html')
}

createRoot(container).render(
  <BrowserRouter>
    <ColorModeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </LocalizationProvider>
    </ColorModeProvider>
  </BrowserRouter>
)
