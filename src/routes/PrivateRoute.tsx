/**
 * PrivateRoute — redirects unauthenticated users to /login.
 * While the session is being restored (isLoading), renders nothing (or a spinner).
 */
import { Navigate, Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '@/hooks/useAuth'

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
