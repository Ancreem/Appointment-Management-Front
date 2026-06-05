/**
 * Appointment-related type definitions.
 * Field names match the backend AppointmentResponse DTO exactly.
 */

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'DELETED'

export interface Appointment {
  id: string
  title: string
  description?: string
  startTime: string   // ISO-8601 OffsetDateTime
  endTime: string     // ISO-8601 OffsetDateTime
  assignedUserId: string
  assignedUserName: string
  status: AppointmentStatus
  createdAt: string
}

export interface CreateAppointmentRequest {
  title: string
  description?: string
  startTime: string
  endTime: string
  assignedUserId: string
}

export interface UpdateAppointmentRequest {
  title?: string
  description?: string
  startTime?: string
  endTime?: string
  assignedUserId?: string
}

export interface AppointmentStatusUpdate {
  status: AppointmentStatus
}

export interface AppointmentFilters {
  status?: AppointmentStatus
  from?: string
  to?: string
}

export interface ListAppointmentsParams extends AppointmentFilters {
  page?: number
  size?: number
  sort?: string
}
