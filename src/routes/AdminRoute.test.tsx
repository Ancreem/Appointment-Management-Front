import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AdminRoute } from './AdminRoute'

const mockUseAuth = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

function renderWithRouter(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/users" element={<h1>Users Page</h1>} />
        </Route>
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminRoute', () => {
  it('renders outlet when user is ADMIN', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'ADMIN' } })
    renderWithRouter('/users')
    expect(screen.getByText('Users Page')).toBeInTheDocument()
  })

  it('redirects to /dashboard when user is not ADMIN', () => {
    mockUseAuth.mockReturnValue({ user: { role: 'USER' } })
    renderWithRouter('/users')
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('redirects to /dashboard when user is null', () => {
    mockUseAuth.mockReturnValue({ user: null })
    renderWithRouter('/users')
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
