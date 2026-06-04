/**
 * Appointments API — full CRUD + paginated list with filters.
 */
import apiClient from './client'
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentStatusUpdate,
  ListAppointmentsParams,
} from '@/types/appointment'
import type { PageResponse } from '@/types/api'

export const appointmentsApi = {
  getAll(params: ListAppointmentsParams = {}): Promise<PageResponse<Appointment>> {
    return apiClient
      .get<PageResponse<Appointment>>('/appointments', { params })
      .then((res) => res.data)
  },

  getById(id: string): Promise<Appointment> {
    return apiClient
      .get<Appointment>(`/appointments/${id}`)
      .then((res) => res.data)
  },

  create(data: CreateAppointmentRequest): Promise<Appointment> {
    return apiClient
      .post<Appointment>('/appointments', data)
      .then((res) => res.data)
  },

  update(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    return apiClient
      .put<Appointment>(`/appointments/${id}`, data)
      .then((res) => res.data)
  },

  updateStatus(id: string, data: AppointmentStatusUpdate): Promise<Appointment> {
    return apiClient
      .patch<Appointment>(`/appointments/${id}/status`, data)
      .then((res) => res.data)
  },

  deleteById(id: string): Promise<void> {
    return apiClient
      .delete<void>(`/appointments/${id}`)
      .then(() => undefined)
  },
}
