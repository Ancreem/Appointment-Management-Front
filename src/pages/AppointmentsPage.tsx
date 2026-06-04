/**
 * AppointmentsPage — full appointments management page.
 *
 * Features:
 *  - Filterable list (status, date range) via AppointmentFiltersBar
 *  - Paginated via MUI Pagination
 *  - Edit, delete, status-change actions
 *  - Delete requires confirmation via ConfirmDialog
 */
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Pagination,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAppointments } from '@/hooks/useAppointments'
import { useAuthContext } from '@/context/AuthContext'
import { AppointmentFiltersBar } from '@/components/features/AppointmentFiltersBar'
import { AppointmentTable } from '@/components/features/AppointmentTable'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { AppointmentStatus } from '@/types/appointment'

const PAGE_SIZE = 10

export default function AppointmentsPage() {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { appointments, loading, error, fetchAll, remove, updateStatus, clearError } =
    useAppointments()

  // Filter state
  const [status, setStatus] = useState<AppointmentStatus | ''>('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // Pagination state
  const [page, setPage] = useState(1) // MUI Pagination is 1-based

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const isAdmin = user?.role === 'ADMIN'
  const currentUserId = user?.userId ?? ''

  // Convert datetime-local string to ISO string for the API
  function toIso(local: string): string | undefined {
    if (!local) return undefined
    return `${local}:00Z`
  }

  const load = useCallback(() => {
    void fetchAll({
      page: page - 1, // API is 0-based
      size: PAGE_SIZE,
      status: status || undefined,
      from: toIso(from),
      to: toIso(to),
    })
  }, [fetchAll, page, status, from, to])

  useEffect(() => {
    load()
  }, [load])

  function handleClearFilters() {
    setStatus('')
    setFrom('')
    setTo('')
    setPage(1)
  }

  function handleFilterChange() {
    setPage(1)
  }

  function handleStatusChange(s: AppointmentStatus | '') {
    setStatus(s)
    handleFilterChange()
  }

  function handleFromChange(v: string) {
    setFrom(v)
    handleFilterChange()
  }

  function handleToChange(v: string) {
    setTo(v)
    handleFilterChange()
  }

  function handleEdit(id: string) {
    navigate(`/appointments/${id}/edit`)
  }

  function handleDeleteRequest(id: string) {
    setDeleteId(id)
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return
    setDeleteLoading(true)
    try {
      await remove(deleteId)
      setDeleteId(null)
      load()
    } catch {
      // error already set in hook
    } finally {
      setDeleteLoading(false)
    }
  }

  async function handleStatusChange2(id: string, newStatus: AppointmentStatus) {
    try {
      await updateStatus(id, { status: newStatus })
      load()
    } catch {
      // error already set in hook
    }
  }

  const totalPages = appointments ? appointments.totalPages : 0
  const rows = appointments?.content ?? []

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/appointments/new')}
        >
          New Appointment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <AppointmentFiltersBar
        status={status}
        onStatusChange={handleStatusChange}
        from={from}
        onFromChange={handleFromChange}
        to={to}
        onToChange={handleToChange}
        onClear={handleClearFilters}
      />

      {/* Table */}
      <AppointmentTable
        appointments={rows}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onStatusChange={handleStatusChange2}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />

      {/* Pagination */}
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

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => setDeleteId(null)}
        confirmLoading={deleteLoading}
        confirmColor="error"
      />
    </Box>
  )
}
