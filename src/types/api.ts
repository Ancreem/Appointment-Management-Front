/**
 * Shared API types used across the application.
 * These mirror the backend ErrorResponse and PagedResponse shapes.
 */

export interface ErrorResponse {
  errorCode: string
  message: string
  timestamp: string
  path: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
