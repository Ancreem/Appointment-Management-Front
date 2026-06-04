/**
 * Authentication API calls.
 * All functions delegate to the shared Axios client which handles token refresh.
 */
import apiClient from './client'
import type { LoginRequest, AuthResponse, TokenRefreshResponse } from '@/types/auth'

export const authApi = {
  login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient
      .post<AuthResponse>('/auth/login', credentials)
      .then((res) => res.data)
  },

  refresh(refreshToken: string): Promise<TokenRefreshResponse> {
    return apiClient
      .post<TokenRefreshResponse>('/auth/refresh', { refreshToken })
      .then((res) => res.data)
  },

  logout(refreshToken: string): Promise<void> {
    return apiClient
      .post<void>('/auth/logout', { refreshToken })
      .then(() => undefined)
  },
}
