/**
 * Appointment-related type definitions.
 */

export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export interface Appointment {
  id: string
  title: string
  description: string | null
  startDatetime: string   // ISO-8601 with timezone offset
  endDatetime: string     // ISO-8601 with timezone offset
  assignedUserId: string
  assignedUserName: string
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
}

export interface CreateAppointmentRequest {
  title: string
  description?: string | null
  startDatetime: string
  endDatetime: string
  assignedUserId: string
}

export interface UpdateAppointmentRequest {
  title: string
  description?: string | null
  startDatetime: string
  endDatetime: string
  assignedUserId: string
}

export interface PatchStatusRequest {
  status: AppointmentStatus
}

export interface AppointmentFilters {
  status?: AppointmentStatus
  startDate?: string
  endDate?: string
  userId?: string
}
