/**
 * Appointments API — full CRUD + paginated list with filters.
 */
import apiClient from './client'
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  PatchStatusRequest,
} from '@/types/appointment'
import type { PagedResponse } from '@/types/api'

export interface ListAppointmentsParams extends AppointmentFilters {
  page?: number
  size?: number
}

export const appointmentsApi = {
  list(params: ListAppointmentsParams = {}): Promise<PagedResponse<Appointment>> {
    return apiClient
      .get<PagedResponse<Appointment>>('/appointments', { params })
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

  patchStatus(id: string, data: PatchStatusRequest): Promise<Appointment> {
    return apiClient
      .patch<Appointment>(`/appointments/${id}/status`, data)
      .then((res) => res.data)
  },

  delete(id: string): Promise<void> {
    return apiClient
      .delete<void>(`/appointments/${id}`)
      .then(() => undefined)
  },
}
