import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppointmentForm } from './AppointmentForm'
import type { User } from '@/types/user'
import type { CreateAppointmentRequest } from '@/types/appointment'

const mockUsers: User[] = [
  { id: 'u1', name: 'User One', email: 'user1@test.com', role: 'USER' },
  { id: 'u2', name: 'User Two', email: 'user2@test.com', role: 'USER' },
]

const defaultProps = {
  onSubmit: vi.fn(),
  onCancel: vi.fn(),
  users: mockUsers,
  isAdmin: false,
  loading: false,
  currentUserId: 'u1',
}

function getDatetimeInputs() {
  return document.querySelectorAll<HTMLInputElement>('input[type="datetime-local"]')
}

describe('AppointmentForm', () => {
  it('renders Title, Description, Start and End fields for USER', () => {
    const { container } = render(<AppointmentForm {...defaultProps} />)
    expect(container.querySelector('input[maxlength="255"]')).toBeInTheDocument()
    expect(container.querySelector('textarea')).toBeInTheDocument()
    expect(getDatetimeInputs()).toHaveLength(2)
  })

  it('hides assigned user selector for USER', () => {
    render(<AppointmentForm {...defaultProps} />)
    expect(screen.queryByText('Assigned To')).not.toBeInTheDocument()
  })

  it('shows assigned user selector for ADMIN', () => {
    render(<AppointmentForm {...defaultProps} isAdmin />)
    expect(screen.getByText('Assigned To')).toBeInTheDocument()
  })

  it('shows validation error when title is empty on submit', async () => {
    render(<AppointmentForm {...defaultProps} />)
    fireEvent.click(screen.getByText('Save'))
    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
  })

  it('shows validation error when end time is before start time', async () => {
    render(<AppointmentForm {...defaultProps} />)
    const [start, end] = getDatetimeInputs()
    fireEvent.change(document.querySelector('input[maxlength="255"]')!, { target: { value: 'Meeting' } })
    fireEvent.change(start, { target: { value: '2026-06-05T15:00' } })
    fireEvent.change(end, { target: { value: '2026-06-05T14:00' } })
    fireEvent.click(screen.getByText('Save'))
    expect(await screen.findByText('End time must be after start time.')).toBeInTheDocument()
  })

  it('calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn()
    render(<AppointmentForm {...defaultProps} onSubmit={onSubmit} />)
    const [start, end] = getDatetimeInputs()
    fireEvent.change(document.querySelector('input[maxlength="255"]')!, { target: { value: 'Team standup' } })
    fireEvent.change(start, { target: { value: '2026-06-05T14:00' } })
    fireEvent.change(end, { target: { value: '2026-06-05T15:00' } })
    fireEvent.click(screen.getByText('Save'))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const callArg = onSubmit.mock.calls[0]?.[0] as CreateAppointmentRequest
    expect(callArg.title).toBe('Team standup')
    expect(callArg.assignedUserId).toBe('u1')
  })

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<AppointmentForm {...defaultProps} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('disables form controls when loading', () => {
    render(<AppointmentForm {...defaultProps} loading />)
    expect(document.querySelector('input[maxlength="255"]')).toBeDisabled()
    expect(screen.getByText('Save')).toBeDisabled()
    expect(screen.getByText('Cancel')).toBeDisabled()
  })
})
