/**
 * AppointmentTable — MUI Table displaying a list of appointments.
 *
 * Columns: Title | Assigned To | Start | End | Status | Actions
 *
 * Status column shows a StatusChip + an inline status-transition Select
 * for non-terminal statuses. Delete button is only shown to admins or the
 * appointment owner.
 */
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatusChip } from '@/components/ui/StatusChip'
import { formatDateTime } from '@/utils/date'
import type { Appointment, AppointmentStatus } from '@/types/appointment'

interface AppointmentTableProps {
  appointments: Appointment[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
  currentUserId: string
  isAdmin: boolean
  loading?: boolean
}

/** Returns the valid next-status transitions for a given status. */
function getTransitions(status: AppointmentStatus): AppointmentStatus[] {
  switch (status) {
    case 'SCHEDULED':
      return ['CONFIRMED', 'CANCELLED']
    case 'CONFIRMED':
      return ['CANCELLED', 'COMPLETED']
    default:
      // CANCELLED and COMPLETED are terminal — no transitions available
      return []
  }
}

const TRANSITION_LABEL: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Scheduled',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
}

export function AppointmentTable({
  appointments,
  onEdit,
  onDelete,
  onStatusChange,
  currentUserId,
  isAdmin,
  loading = false,
}: AppointmentTableProps) {
  if (loading) {
    return <LoadingSpinner />
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        title="No appointments found"
        subtitle="Try adjusting your filters or create a new appointment."
      />
    )
  }

  function handleTransitionChange(
    appointmentId: string,
    e: SelectChangeEvent<AppointmentStatus>
  ) {
    onStatusChange(appointmentId, e.target.value as AppointmentStatus)
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appt) => {
            const transitions = getTransitions(appt.status)
            const canDelete = isAdmin || appt.assignedUserId === currentUserId

            return (
              <TableRow key={appt.id} hover>
                <TableCell>{appt.title}</TableCell>
                <TableCell>{appt.assignedUserName}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {formatDateTime(appt.startTime)}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {formatDateTime(appt.endTime)}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StatusChip status={appt.status} />
                    {transitions.length > 0 && (
                      <Select<AppointmentStatus>
                        size="small"
                        value={appt.status}
                        onChange={(e) => handleTransitionChange(appt.id, e)}
                        sx={{ fontSize: '0.75rem', minWidth: 120 }}
                        variant="standard"
                      >
                        {/* Current status as a display-only anchor */}
                        <MenuItem value={appt.status} disabled>
                          {TRANSITION_LABEL[appt.status]}
                        </MenuItem>
                        {transitions.map((t) => (
                          <MenuItem key={t} value={t}>
                            {TRANSITION_LABEL[t]}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(appt.id)}
                      aria-label={`Edit ${appt.title}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {canDelete && (
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(appt.id)}
                        aria-label={`Delete ${appt.title}`}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
