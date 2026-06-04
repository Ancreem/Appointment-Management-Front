/**
 * AdminRoute — redirects non-ADMIN users to /dashboard.
 * Must be nested inside PrivateRoute so user is guaranteed to be authenticated.
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function AdminRoute() {
  const { user } = useAuth()

  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
