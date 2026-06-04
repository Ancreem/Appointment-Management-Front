/**
 * Users API — read-only list (ADMIN only endpoint).
 */
import apiClient from './client'
import type { User } from '@/types/user'

export const usersApi = {
  getAll(): Promise<User[]> {
    return apiClient
      .get<User[]>('/users')
      .then((res) => res.data)
  },
}
