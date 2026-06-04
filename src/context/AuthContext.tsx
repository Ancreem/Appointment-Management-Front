/**
 * AuthContext — application-wide authentication state.
 *
 * Access token: stored exclusively in the module-level variable inside client.ts
 *               (never in React state, never in localStorage).
 * Refresh token: stored in localStorage so sessions survive page reloads.
 *
 * On mount, if a refresh token exists in localStorage, the context attempts
 * a silent refresh to restore the session without requiring re-login.
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
import type { AuthUser, LoginRequest } from '@/types/auth'

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Context instance
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | null>(null)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function decodeUserFromToken(accessToken: string): AuthUser {
  // JWT payload is Base64URL-encoded in the second segment
  const payload = JSON.parse(atob(accessToken.split('.')[1] ?? ''))
  return {
    id: payload.sub as string,
    email: payload.sub as string,
    role: payload.role as AuthUser['role'],
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
        setUser(decodeUserFromToken(accessToken))
      })
      .catch(() => {
        // Refresh failed — clear stale token
        localStorage.removeItem('refreshToken')
        setAccessToken(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    const { accessToken, refreshToken } = await authApi.login(credentials)
    setAccessToken(accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(decodeUserFromToken(accessToken))
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
// Hook
// ---------------------------------------------------------------------------
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return ctx
}
