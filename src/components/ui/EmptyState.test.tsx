import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items found" />)
    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<EmptyState title="No items" subtitle="Try again later" />)
    expect(screen.getByText('Try again later')).toBeInTheDocument()
  })

  it('renders without subtitle', () => {
    const { container } = render(<EmptyState title="Only title" />)
    expect(container.textContent).toBe('Only title')
  })
})
