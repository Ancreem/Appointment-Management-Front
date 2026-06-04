/**
 * Auth-related type definitions.
 */

export type UserRole = 'ADMIN' | 'USER'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}
