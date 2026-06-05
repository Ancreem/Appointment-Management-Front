/**
 * AppointmentForm — controlled form for creating or editing an appointment.
 *
 * - All state is managed internally; the parent receives the final values
 *   via onSubmit only.
 * - When isAdmin is false, assignedUserId is hidden and automatically set to
 *   the currentUserId supplied through initialValues.
 * - Basic client-side validation: title required, endTime > startTime.
 */
import React, { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import type { CreateAppointmentRequest } from '@/types/appointment'
import type { User } from '@/types/user'

interface AppointmentFormProps {
  initialValues?: Partial<CreateAppointmentRequest>
  onSubmit: (values: CreateAppointmentRequest) => Promise<void>
  onCancel: () => void
  users: User[]
  isAdmin: boolean
  loading: boolean
  /** The current user's id — used as the default assignedUserId for non-admins. */
  currentUserId?: string
}

interface FormErrors {
  title?: string
  startTime?: string
  endTime?: string
  assignedUserId?: string
}

/**
 * Converts a UTC ISO-8601 string to the datetime-local input format in LOCAL time.
 * e.g. "2026-06-05T20:06:00Z" → "2026-06-05T15:06" (in UTC-5)
 */
function isoToDatetimeLocal(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Converts a datetime-local value (treated as LOCAL time) to a UTC ISO string.
 * e.g. "2026-06-05T15:06" → "2026-06-05T20:06:00.000Z" (in UTC-5)
 */
function datetimeLocalToIso(local: string): string {
  if (!local) return ''
  return new Date(local).toISOString()
}

export function AppointmentForm({
  initialValues = {},
  onSubmit,
  onCancel,
  users,
  isAdmin,
  loading,
  currentUserId = '',
}: AppointmentFormProps) {
  const [title, setTitle] = useState(initialValues.title ?? '')
  const [description, setDescription] = useState(initialValues.description ?? '')
  const [startTime, setStartTime] = useState(
    isoToDatetimeLocal(initialValues.startTime ?? '')
  )
  const [endTime, setEndTime] = useState(
    isoToDatetimeLocal(initialValues.endTime ?? '')
  )
  const [assignedUserId, setAssignedUserId] = useState(
    initialValues.assignedUserId ?? currentUserId
  )
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): boolean {
    const next: FormErrors = {}

    if (!title.trim()) {
      next.title = 'Title is required.'
    } else if (title.length > 255) {
      next.title = 'Title must be 255 characters or fewer.'
    }

    if (!startTime) {
      next.startTime = 'Start time is required.'
    }

    if (!endTime) {
      next.endTime = 'End time is required.'
    } else if (startTime && endTime <= startTime) {
      next.endTime = 'End time must be after start time.'
    }

    if (isAdmin && !assignedUserId) {
      next.assignedUserId = 'Please select a user.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      startTime: datetimeLocalToIso(startTime),
      endTime: datetimeLocalToIso(endTime),
      assignedUserId: isAdmin ? assignedUserId : currentUserId,
    })
  }

  function handleAssignedUserChange(e: SelectChangeEvent<string>) {
    setAssignedUserId(e.target.value)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={Boolean(errors.title)}
          helperText={errors.title}
          required
          fullWidth
          inputProps={{ maxLength: 255 }}
          disabled={loading}
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          disabled={loading}
        />

        <TextField
          label="Start Time"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          error={Boolean(errors.startTime)}
          helperText={errors.startTime}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          disabled={loading}
        />

        <TextField
          label="End Time"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          error={Boolean(errors.endTime)}
          helperText={errors.endTime}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          disabled={loading}
        />

        {isAdmin && (
          <FormControl fullWidth error={Boolean(errors.assignedUserId)} required>
            <InputLabel id="assigned-user-label">Assigned To</InputLabel>
            <Select
              labelId="assigned-user-label"
              label="Assigned To"
              value={assignedUserId}
              onChange={handleAssignedUserChange}
              disabled={loading}
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </MenuItem>
              ))}
            </Select>
            {errors.assignedUserId && (
              <FormHelperText>{errors.assignedUserId}</FormHelperText>
            )}
          </FormControl>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
