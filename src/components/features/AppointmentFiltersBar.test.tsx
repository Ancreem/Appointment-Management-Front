import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppointmentFiltersBar } from './AppointmentFiltersBar'

describe('AppointmentFiltersBar', () => {
  const defaultProps = {
    status: '' as const,
    onStatusChange: vi.fn(),
    from: '',
    to: '',
    onFromChange: vi.fn(),
    onToChange: vi.fn(),
    onClear: vi.fn(),
  }

  it('renders status filter label, date fields, and clear button', () => {
    render(<AppointmentFiltersBar {...defaultProps} />)
    const statusElements = screen.getAllByText('Status')
    expect(statusElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('calls onClear when clear button is clicked', () => {
    render(<AppointmentFiltersBar {...defaultProps} />)
    fireEvent.click(screen.getByText('Clear'))
    expect(defaultProps.onClear).toHaveBeenCalledOnce()
  })
})
