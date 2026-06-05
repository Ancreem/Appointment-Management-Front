import { describe, it, expect } from 'vitest'
import { formatDateTime, formatDate, toISOString } from './date'

describe('formatDateTime', () => {
  it('formats ISO string to human-readable datetime', () => {
    const result = formatDateTime('2026-06-05T15:00:00Z')
    expect(result).toContain('Jun')
    expect(result).toContain('5')
    expect(result).toContain('2026')
  })

  it('handles midnight correctly', () => {
    const result = formatDateTime('2026-06-01T00:00:00Z')
    expect(result).toMatch(/^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}/)
  })
})

describe('formatDate', () => {
  it('formats ISO string to short date', () => {
    const result = formatDate('2026-06-05T15:00:00Z')
    expect(result).toContain('Jun')
    expect(result).toContain('5')
    expect(result).toContain('2026')
  })
})

describe('toISOString', () => {
  it('converts Date to ISO string', () => {
    const date = new Date('2026-06-05T15:00:00Z')
    const result = toISOString(date)
    expect(result).toMatch(/^2026-06-0[5-6]T/)
  })

  it('converts string to ISO string', () => {
    const result = toISOString('2026-06-05T15:00:00Z')
    expect(result).toMatch(/^2026-06-0[5-6]T/)
  })
})
