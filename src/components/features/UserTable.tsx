/**
 * UserTable — read-only MUI Table displaying a list of users.
 *
 * Columns: Name | Email | Role
 * Role is displayed as a color-coded MUI Chip.
 */
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { SkeletonTable } from '@/components/ui/SkeletonTable'
import { EmptyState } from '@/components/ui/EmptyState'
import type { User } from '@/types/user'
import type { UserRole } from '@/types/auth'

interface UserTableProps {
  users: User[]
  loading?: boolean
}

const ROLE_COLOR: Record<UserRole, 'primary' | 'default'> = {
  ADMIN: 'primary',
  USER: 'default',
}

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Admin',
  USER: 'User',
}

export function UserTable({ users, loading = false }: UserTableProps) {
  if (loading) {
    return <SkeletonTable rows={5} columns={3} />
  }

  if (users.length === 0) {
    return <EmptyState title="No users found" />
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip
                  label={ROLE_LABEL[user.role]}
                  color={ROLE_COLOR[user.role]}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
