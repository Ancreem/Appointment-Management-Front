/**
 * useUsers hook — paginated user list with loading/error state.
 */
import { useState, useCallback } from 'react'
import { usersApi, type ListUsersParams } from '@/api/users.api'
import type { User } from '@/types/user'
import type { PageResponse } from '@/types/api'

interface UseUsersState {
  users: PageResponse<User> | null
  loading: boolean
  error: string | null
}

interface UseUsersReturn extends UseUsersState {
  fetchAll: (params?: ListUsersParams) => Promise<void>
  clearError: () => void
}

export function useUsers(): UseUsersReturn {
  const [state, setState] = useState<UseUsersState>({
    users: null,
    loading: false,
    error: null,
  })

  const fetchAll = useCallback(async (params?: ListUsersParams): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await usersApi.getAll(params)
      setState({ users: data, loading: false, error: null })
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: 'Failed to load users' }))
    }
  }, [])

  const clearError = useCallback(() =>
    setState((prev) => ({ ...prev, error: null })), [])

  return { ...state, fetchAll, clearError }
}
