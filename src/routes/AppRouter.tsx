/**
 * AppRouter — top-level route configuration.
 *
 * Route hierarchy:
 *   /login               — public, uses AuthLayout
 *   /                    — protected, uses AppLayout
 *     /dashboard         — all authenticated users
 *     /appointments      — all authenticated users
 *     /appointments/new  — all authenticated users
 *     /appointments/:id/edit — all authenticated users
 *     /users             — ADMIN only
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { AdminRoute } from './AdminRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { lazy, Suspense } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Lazy-loaded pages — implemented in Stage 7
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const AppointmentsPage = lazy(() => import('@/pages/AppointmentsPage'))
const AppointmentFormPage = lazy(() => import('@/pages/AppointmentFormPage'))
const UsersPage = lazy(() => import('@/pages/UsersPage'))

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress />
    </Box>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/appointments/new" element={<AppointmentFormPage />} />
            <Route path="/appointments/:id/edit" element={<AppointmentFormPage />} />

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
