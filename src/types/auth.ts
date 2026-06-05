/**
 * Auth-related type definitions.
 * Matches the backend AuthResponse and related DTOs.
 */

export type UserRole = 'ADMIN' | 'USER'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  userId: string
  role: UserRole
  email: string
  name: string
}

export interface TokenRefreshResponse {
  accessToken: string
  refreshToken: string
}

/**
 * Authenticated user stored in React state.
 * Derived from the backend AuthResponse (not decoded from JWT).
 */
export interface AuthUser {
  userId: string
  role: UserRole
  email: string
  name: string
}
