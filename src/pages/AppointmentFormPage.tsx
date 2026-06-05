/**
 * AppointmentFormPage — create or edit an appointment.
 *
 * Mode detection: if :id is present in the route → edit mode, otherwise create.
 *
 * In edit mode, the existing appointment is fetched on mount and used to
 * populate the form via initialValues. The users list is fetched for admins
 * so the assignedUserId selector is populated.
 */
import { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Alert,
  Box,
  Button,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useAppointments } from '@/hooks/useAppointments'
import { useUsers } from '@/hooks/useUsers'
import { useAuthContext } from '@/context/AuthContext'
import { AppointmentForm } from '@/components/features/AppointmentForm'
import type { CreateAppointmentRequest } from '@/types/appointment'

export default function AppointmentFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)

  const navigate = useNavigate()
  const { user } = useAuthContext()

  const {
    appointment,
    loading: apptLoading,
    error: apptError,
    fetchById,
    create,
    update,
    clearError: clearApptError,
  } = useAppointments()

  const {
    users,
    loading: usersLoading,
    error: usersError,
    fetchAll: fetchUsers,
    clearError: clearUsersError,
  } = useUsers()

  const isAdmin = user?.role === 'ADMIN'
  const currentUserId = user?.userId ?? ''

  const loadData = useCallback(() => {
    if (isEditMode && id) {
      void fetchById(id)
    }
    if (isAdmin) {
      void fetchUsers({ page: 0, size: 100 })
    }
  }, [isEditMode, id, isAdmin, fetchById, fetchUsers])

  useEffect(() => {
    loadData()
  }, [loadData])

  function hasChanges(values: CreateAppointmentRequest): boolean {
    if (!appointment) return true
    const sameTime = (a: string, b: string) =>
      new Date(a).getTime() === new Date(b).getTime()
    return (
      values.title !== appointment.title ||
      (values.description ?? '') !== (appointment.description ?? '') ||
      !sameTime(values.startTime, appointment.startTime) ||
      !sameTime(values.endTime, appointment.endTime) ||
      values.assignedUserId !== appointment.assignedUserId
    )
  }

  async function handleSubmit(values: CreateAppointmentRequest) {
    if (isEditMode && id) {
      if (!hasChanges(values)) {
        toast.info('No changes detected')
        navigate('/appointments')
        return
      }
      await update(id, values)
      toast.success('Appointment updated successfully')
    } else {
      await create(values)
      toast.success('Appointment created successfully')
    }
    navigate('/appointments')
  }

  function handleCancel() {
    navigate('/appointments')
  }

  const isLoading = apptLoading || usersLoading
  const error = apptError ?? usersError

  // Build initialValues from the fetched appointment in edit mode
  const initialValues: Partial<CreateAppointmentRequest> =
    isEditMode && appointment
      ? {
          title: appointment.title,
          description: appointment.description,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          assignedUserId: appointment.assignedUserId,
        }
      : {}

  // In edit mode, wait until we have the appointment data before rendering the form
  const showSpinner = isEditMode && apptLoading && !appointment

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Typography variant="h5" fontWeight={600}>
          {isEditMode ? 'Edit Appointment' : 'New Appointment'}
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => {
            clearApptError()
            clearUsersError()
          }}
        >
          {error}
        </Alert>
      )}

      {showSpinner ? (
        <Stack spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              animation="wave"
              variant="rectangular"
              height={56}
              sx={{ borderRadius: 1 }}
            />
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Skeleton animation="wave" variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
            <Skeleton animation="wave" variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
          </Box>
        </Stack>
      ) : (
        <AppointmentForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          users={users?.content ?? []}
          isAdmin={isAdmin}
          loading={isLoading}
          currentUserId={currentUserId}
        />
      )}
    </Box>
  )
}
