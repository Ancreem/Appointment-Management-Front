import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders a CircularProgress', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument()
  })
})
