/**
 * AppointmentsPage — full appointments management page.
 *
 * Features:
 *  - Filterable list (status, date range) via AppointmentFiltersBar
 *  - Paginated via MUI Pagination
 *  - Edit, delete, status-change actions
 *  - Delete requires confirmation via ConfirmDialog
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
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
import type { Appointment, AppointmentStatus } from '@/types/appointment'

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

  // Soft-delete + undo state
  const [pendingCancel, setPendingCancel] = useState<Appointment | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastId = useRef<string | number | null>(null)
  const UNDO_MS = 5000

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

  function commitDelete(target: Appointment) {
    void updateStatus(target.id, { status: 'DELETED' }).then(load)
    setPendingCancel(null)
    undoTimer.current = null
  }

  function handleDeleteRequest(id: string) {
    const target = rows.find((a) => a.id === id)
    if (!target) return

    // If another delete is in flight, commit it first
    if (undoTimer.current) {
      clearTimeout(undoTimer.current)
      if (pendingCancel) commitDelete(pendingCancel)
    }

    // Dismiss previous toast
    if (toastId.current) toast.dismiss(toastId.current)

    setPendingCancel(target)

    toastId.current = toast(`"${target.title}" will be deleted`, {
      duration: UNDO_MS,
      action: {
        label: 'Undo',
        onClick: () => handleUndo(),
      },
    })

    undoTimer.current = setTimeout(() => {
      commitDelete(target)
    }, UNDO_MS)
  }

  function handleUndo() {
    if (undoTimer.current) {
      clearTimeout(undoTimer.current)
      undoTimer.current = null
    }
    if (toastId.current) {
      toast.dismiss(toastId.current)
      toastId.current = null
    }
    setPendingCancel(null)
    toast.success('Deletion cancelled')
  }

  async function handleStatusChange2(id: string, newStatus: AppointmentStatus) {
    try {
      await updateStatus(id, { status: newStatus })
      toast.success(`Status changed to ${newStatus.toLowerCase()}`)
      load()
    } catch {
      // error already set in hook
    }
  }

  const totalPages = appointments ? appointments.totalPages : 0
  // Hide the pending-cancel row immediately (optimistic update)
  const rows = (appointments?.content ?? []).filter((a) => a.id !== pendingCancel?.id)

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

    </Box>
  )
}
