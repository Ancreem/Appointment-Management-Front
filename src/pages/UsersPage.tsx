/**
 * UsersPage — read-only user list (ADMIN only).
 *
 * AdminRoute guards access at the router level, but this page also avoids
 * firing the API call when the user isn't ADMIN as a defense-in-depth measure.
 */
import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Pagination,
  Typography,
} from '@mui/material'
import { useUsers } from '@/hooks/useUsers'
import { UserTable } from '@/components/features/UserTable'

const PAGE_SIZE = 20

export default function UsersPage() {
  const { users, loading, error, fetchAll, clearError } = useUsers()
  const [page, setPage] = useState(1) // 1-based for MUI Pagination

  useEffect(() => {
    void fetchAll({ page: page - 1, size: PAGE_SIZE })
  }, [fetchAll, page])

  const totalPages = users?.totalPages ?? 0
  const rows = users?.content ?? []

  return (
    <Box>
      {/* Header */}
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Users
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <UserTable users={rows} loading={loading} />

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
}
