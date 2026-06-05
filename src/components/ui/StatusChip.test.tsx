import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusChip } from './StatusChip'

describe('StatusChip', () => {
  it.each([
    { status: 'SCHEDULED' as const, label: 'Scheduled' },
    { status: 'CONFIRMED' as const, label: 'Confirmed' },
    { status: 'CANCELLED' as const, label: 'Cancelled' },
    { status: 'COMPLETED' as const, label: 'Completed' },
    { status: 'DELETED' as const, label: 'Deleted' },
  ])('renders $status as "$label"', ({ status, label }) => {
    render(<StatusChip status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
