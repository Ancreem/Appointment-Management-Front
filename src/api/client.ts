/**
 * Axios client with JWT access token management and refresh-token rotation.
 *
 * Access token lives exclusively in memory (module-level variable).
 * Refresh token is stored in localStorage so sessions survive page reloads.
 *
 * Concurrent 401 responses are de-duplicated: only one refresh call is in flight
 * at any time. All other 401-failed requests wait in a queue and are replayed
 * once the refresh completes.
 */
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// ---------------------------------------------------------------------------
// In-memory access token store
// ---------------------------------------------------------------------------
let accessToken: string | null = null

export function setAccessToken(token: string | null): void {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

// ---------------------------------------------------------------------------
// Refresh de-duplication state
// ---------------------------------------------------------------------------
let isRefreshing = false
type FailedQueueEntry = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}
const failedQueue: FailedQueueEntry[] = []

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((entry) => {
    if (error) {
      entry.reject(error)
    } else {
      entry.resolve(token as string)
    }
  })
  failedQueue.length = 0
}

// ---------------------------------------------------------------------------
// Session cleanup
// ---------------------------------------------------------------------------
function clearSession(): void {
  setAccessToken(null)
  localStorage.removeItem('refreshToken')
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const apiClient = axios.create({
  baseURL: import.meta.env['VITE_API_BASE_URL'] ?? '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401 with refresh-token rotation
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    const is401 = error.response?.status === 401
    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh')
    const alreadyRetried = originalRequest._retry === true

    // Avoid infinite loops on the refresh endpoint itself or already-retried requests
    if (!is401 || isRefreshEndpoint || alreadyRetried) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Enqueue and wait for the in-flight refresh to complete
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`
            }
            originalRequest._retry = true
            resolve(apiClient(originalRequest))
          },
          reject,
        })
      })
    }

    isRefreshing = true
    originalRequest._retry = true

    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (!storedRefreshToken) {
      clearSession()
      isRefreshing = false
      processQueue(error)
      return Promise.reject(error)
    }

    try {
      const refreshResponse = await axios.post(
        `${import.meta.env['VITE_API_BASE_URL'] ?? '/api/v1'}/auth/refresh`,
        { refreshToken: storedRefreshToken }
      )
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data as {
        accessToken: string
        refreshToken: string
      }

      setAccessToken(newAccessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      processQueue(null, newAccessToken)

      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
      }
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      clearSession()
      // Let consumers handle redirect — avoid hard coupling to react-router here
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default apiClient
