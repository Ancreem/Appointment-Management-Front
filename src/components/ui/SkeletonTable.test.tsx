import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SkeletonTable } from './SkeletonTable'

describe('SkeletonTable', () => {
  it('renders skeleton cells for rows and columns', () => {
    const { container } = render(<SkeletonTable rows={3} columns={4} />)
    const cells = container.querySelectorAll('.MuiSkeleton-root')
    // Header: 4 cells + Body: 3 rows × 4 cells = 12 → total 16
    expect(cells.length).toBe(4 + 3 * 4)
  })

  it('renders skeleton with default rows', () => {
    const { container } = render(<SkeletonTable columns={2} />)
    const cells = container.querySelectorAll('.MuiSkeleton-root')
    // Header: 2 cells + Body: 5 rows × 2 cells = 10 → total 12
    expect(cells.length).toBe(2 + 5 * 2)
  })
})
