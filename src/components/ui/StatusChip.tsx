/**
 * StatusChip — MUI Chip colored by AppointmentStatus.
 *
 * SCHEDULED  → default (grey)
 * CONFIRMED  → primary (blue)
 * CANCELLED  → error (red)
 * COMPLETED  → success (green)
 * DELETED    → default + strikethrough (visually distinct from cancelled)
 */
import { Chip } from '@mui/material'
import type { AppointmentStatus } from '@/types/appointment'

interface StatusChipProps {
  status: AppointmentStatus
}

const STATUS_COLOR: Record<
  AppointmentStatus,
  'default' | 'primary' | 'error' | 'success' | 'warning'
> = {
  SCHEDULED: 'default',
  CONFIRMED: 'primary',
  CANCELLED: 'error',
  COMPLETED: 'success',
  DELETED: 'warning',
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Scheduled',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  DELETED: 'Deleted',
}

export function StatusChip({ status }: StatusChipProps) {
  return (
    <Chip
      label={STATUS_LABEL[status]}
      color={STATUS_COLOR[status]}
      size="small"
      sx={status === 'DELETED' ? { textDecoration: 'line-through', opacity: 0.7 } : undefined}
    />
  )
}
