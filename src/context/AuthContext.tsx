/**
 * AuthContext — application-wide authentication state.
 *
 * Access token: stored exclusively in the module-level variable inside client.ts
 *               (never in React state, never in localStorage).
 * Refresh token: stored in localStorage so sessions survive page reloads.
 *
 * On mount, if a refresh token exists in localStorage, the context attempts
 * a silent refresh to restore the session without requiring re-login.
 * User info for the restored session is decoded from the new access token JWT.
 *
 * On login, user info is taken directly from the backend AuthResponse body.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import { authApi } from '@/api/auth.api'
import { setAccessToken } from '@/api/client'
import type { AuthUser, UserRole } from '@/types/auth'

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Context instance
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | null>(null)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Decodes the JWT payload to extract userId and role.
 * Used when restoring a session from a refresh token (the refresh response
 * does not include userId/role in the body).
 */
function decodeUserFromAccessToken(token: string): AuthUser {
  const payloadBase64 = token.split('.')[1] ?? ''
  const payload = JSON.parse(atob(payloadBase64)) as Record<string, unknown>
  return {
    userId: payload['sub'] as string,
    role: payload['role'] as UserRole,
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on initial mount
  useEffect(() => {
    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (!storedRefreshToken) {
      setIsLoading(false)
      return
    }

    authApi
      .refresh(storedRefreshToken)
      .then(({ accessToken, refreshToken }) => {
        setAccessToken(accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        setUser(decodeUserFromAccessToken(accessToken))
      })
      .catch(() => {
        // Refresh failed — clear stale token, stay logged out
        localStorage.removeItem('refreshToken')
        setAccessToken(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const response = await authApi.login({ email, password })
    setAccessToken(response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
    setUser({ userId: response.userId, role: response.role })
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    const storedRefreshToken = localStorage.getItem('refreshToken')
    try {
      if (storedRefreshToken) {
        await authApi.logout(storedRefreshToken)
      }
    } finally {
      setAccessToken(null)
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }, [])

  // Show nothing while restoring session to avoid flash of login page
  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook — named export for direct context consumers
// ---------------------------------------------------------------------------
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used inside an AuthProvider')
  }
  return ctx
}

// ---------------------------------------------------------------------------
// Backward-compatible alias (hooks/useAuth.ts re-exports this)
// ---------------------------------------------------------------------------
export { useAuthContext as useAuth }
