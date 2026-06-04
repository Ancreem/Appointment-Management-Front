/**
 * AppointmentFiltersBar — row of filter controls for the appointments list.
 * Presentational: all state is lifted to the parent via props.
 */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import type { AppointmentStatus } from '@/types/appointment'

interface AppointmentFiltersBarProps {
  status: AppointmentStatus | ''
  onStatusChange: (s: AppointmentStatus | '') => void
  from: string
  to: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
  onClear: () => void
}

const STATUS_OPTIONS: Array<{ value: AppointmentStatus | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'COMPLETED', label: 'Completed' },
]

export function AppointmentFiltersBar({
  status,
  onStatusChange,
  from,
  to,
  onFromChange,
  onToChange,
  onClear,
}: AppointmentFiltersBarProps) {
  function handleStatusChange(e: SelectChangeEvent<AppointmentStatus | ''>) {
    onStatusChange(e.target.value as AppointmentStatus | '')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        mb: 2,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select<AppointmentStatus | ''>
          labelId="status-filter-label"
          label="Status"
          value={status}
          onChange={handleStatusChange}
        >
          {STATUS_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="From"
        type="datetime-local"
        size="small"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 210 }}
      />

      <TextField
        label="To"
        type="datetime-local"
        size="small"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 210 }}
      />

      <Button variant="outlined" size="small" onClick={onClear}>
        Clear
      </Button>
    </Box>
  )
}
