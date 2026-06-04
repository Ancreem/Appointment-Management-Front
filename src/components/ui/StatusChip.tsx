/**
 * StatusChip — MUI Chip colored by AppointmentStatus.
 *
 * SCHEDULED  → default (grey)
 * CONFIRMED  → primary (blue)
 * CANCELLED  → error (red)
 * COMPLETED  → success (green)
 */
import { Chip } from '@mui/material'
import type { AppointmentStatus } from '@/types/appointment'

interface StatusChipProps {
  status: AppointmentStatus
}

const STATUS_COLOR: Record<
  AppointmentStatus,
  'default' | 'primary' | 'error' | 'success'
> = {
  SCHEDULED: 'default',
  CONFIRMED: 'primary',
  CANCELLED: 'error',
  COMPLETED: 'success',
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Scheduled',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
}

export function StatusChip({ status }: StatusChipProps) {
  return (
    <Chip
      label={STATUS_LABEL[status]}
      color={STATUS_COLOR[status]}
      size="small"
    />
  )
}
