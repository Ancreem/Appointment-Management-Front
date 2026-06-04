/**
 * useAppointments hook — appointment CRUD operations with loading/error state.
 */
import { useState, useCallback } from 'react'
import { appointmentsApi } from '@/api/appointments.api'
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentStatusUpdate,
  ListAppointmentsParams,
} from '@/types/appointment'
import type { PageResponse } from '@/types/api'

interface UseAppointmentsState {
  appointments: PageResponse<Appointment> | null
  appointment: Appointment | null
  loading: boolean
  error: string | null
}

interface UseAppointmentsReturn extends UseAppointmentsState {
  fetchAll: (params?: ListAppointmentsParams) => Promise<void>
  fetchById: (id: string) => Promise<void>
  create: (data: CreateAppointmentRequest) => Promise<Appointment>
  update: (id: string, data: UpdateAppointmentRequest) => Promise<Appointment>
  updateStatus: (id: string, data: AppointmentStatusUpdate) => Promise<Appointment>
  remove: (id: string) => Promise<void>
  clearError: () => void
}

export function useAppointments(): UseAppointmentsReturn {
  const [state, setState] = useState<UseAppointmentsState>({
    appointments: null,
    appointment: null,
    loading: false,
    error: null,
  })

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading }))

  const setError = (error: string | null) =>
    setState((prev) => ({ ...prev, loading: false, error }))

  const fetchAll = useCallback(async (params?: ListAppointmentsParams): Promise<void> => {
    setLoading(true)
    try {
      const data = await appointmentsApi.getAll(params)
      setState((prev) => ({ ...prev, appointments: data, loading: false, error: null }))
    } catch {
      setError('Failed to load appointments')
    }
  }, [])

  const fetchById = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    try {
      const data = await appointmentsApi.getById(id)
      setState((prev) => ({ ...prev, appointment: data, loading: false, error: null }))
    } catch {
      setError('Failed to load appointment')
    }
  }, [])

  const create = useCallback(async (data: CreateAppointmentRequest): Promise<Appointment> => {
    setLoading(true)
    try {
      const created = await appointmentsApi.create(data)
      setState((prev) => ({ ...prev, loading: false, error: null }))
      return created
    } catch {
      setError('Failed to create appointment')
      throw new Error('Failed to create appointment')
    }
  }, [])

  const update = useCallback(
    async (id: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
      setLoading(true)
      try {
        const updated = await appointmentsApi.update(id, data)
        setState((prev) => ({ ...prev, loading: false, error: null }))
        return updated
      } catch {
        setError('Failed to update appointment')
        throw new Error('Failed to update appointment')
      }
    },
    []
  )

  const updateStatus = useCallback(
    async (id: string, data: AppointmentStatusUpdate): Promise<Appointment> => {
      setLoading(true)
      try {
        const updated = await appointmentsApi.updateStatus(id, data)
        setState((prev) => ({ ...prev, loading: false, error: null }))
        return updated
      } catch {
        setError('Failed to update appointment status')
        throw new Error('Failed to update appointment status')
      }
    },
    []
  )

  const remove = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    try {
      await appointmentsApi.deleteById(id)
      setState((prev) => ({ ...prev, loading: false, error: null }))
    } catch {
      setError('Failed to delete appointment')
      throw new Error('Failed to delete appointment')
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    ...state,
    fetchAll,
    fetchById,
    create,
    update,
    updateStatus,
    remove,
    clearError,
  }
}
