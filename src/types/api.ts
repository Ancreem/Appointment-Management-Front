/**
 * Shared API types used across the application.
 * These mirror the backend PageResponse and ErrorResponse shapes.
 */

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface ErrorResponse {
  status: number
  error: string
  message: string
  timestamp: string
  path: string
}
