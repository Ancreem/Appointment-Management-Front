import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppointmentTable } from './AppointmentTable'
import type { Appointment } from '@/types/appointment'

const mockAppointment: Appointment = {
  id: 'a1',
  title: 'Team standup',
  description: 'Daily sync',
  startTime: '2026-06-05T14:00:00Z',
  endTime: '2026-06-05T14:30:00Z',
  assignedUserId: 'u1',
  assignedUserName: 'User One',
  status: 'SCHEDULED',
  createdAt: '2026-06-01T10:00:00Z',
}

const terminalAppointment: Appointment = {
  ...mockAppointment,
  id: 'a2',
  title: 'Completed meeting',
  status: 'COMPLETED',
}

const defaultProps = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onStatusChange: vi.fn(),
  currentUserId: 'u2',
  isAdmin: false,
}

describe('AppointmentTable', () => {
  it('renders appointments', () => {
    render(<AppointmentTable appointments={[mockAppointment]} {...defaultProps} />)
    expect(screen.getByText('Team standup')).toBeInTheDocument()
    expect(screen.getByText('User One')).toBeInTheDocument()
    const scheduledElements = screen.getAllByText('Scheduled')
    expect(scheduledElements.length).toBeGreaterThanOrEqual(1)
  })

  it('shows skeleton when loading', () => {
    const { container } = render(
      <AppointmentTable appointments={[]} {...defaultProps} loading />
    )
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument()
  })

  it('shows empty state when no appointments', () => {
    render(<AppointmentTable appointments={[]} {...defaultProps} />)
    expect(screen.getByText('No appointments found')).toBeInTheDocument()
  })

  it('shows delete button for own appointment as USER', () => {
    render(
      <AppointmentTable
        appointments={[mockAppointment]}
        {...defaultProps}
        currentUserId="u1"
      />
    )
    expect(screen.getByLabelText('Delete Team standup')).toBeInTheDocument()
  })

  it('hides delete button for other user appointment as USER', () => {
    render(<AppointmentTable appointments={[mockAppointment]} {...defaultProps} />)
    expect(screen.queryByLabelText('Delete Team standup')).not.toBeInTheDocument()
  })

  it('shows delete button for any appointment as ADMIN', () => {
    render(
      <AppointmentTable appointments={[mockAppointment]} {...defaultProps} isAdmin />
    )
    expect(screen.getByLabelText('Delete Team standup')).toBeInTheDocument()
  })

  it('disables edit for terminal statuses', () => {
    render(<AppointmentTable appointments={[terminalAppointment]} {...defaultProps} />)
    expect(screen.getByLabelText('Cannot edit a completed, cancelled or deleted appointment')).toBeInTheDocument()
  })
})
