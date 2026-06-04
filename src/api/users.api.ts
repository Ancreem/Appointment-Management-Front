/**
 * Users API — read-only paginated list (ADMIN only endpoint).
 */
import apiClient from './client'
import type { User } from '@/types/user'
import type { PageResponse } from '@/types/api'

export interface ListUsersParams {
  page?: number
  size?: number
}

export const usersApi = {
  getAll(params: ListUsersParams = {}): Promise<PageResponse<User>> {
    return apiClient
      .get<PageResponse<User>>('/users', { params })
      .then((res) => res.data)
  },
}
