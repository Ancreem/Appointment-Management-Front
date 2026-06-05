import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'

const mockUseAuth = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

function renderWithRouter(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        </Route>
        <Route path="/login" element={<h1>Login Page</h1>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PrivateRoute', () => {
  it('renders outlet when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false })
    renderWithRouter('/dashboard')
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('redirects to /login when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false })
    renderWithRouter('/dashboard')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('shows spinner while loading', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true })
    const { container } = renderWithRouter('/dashboard')
    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument()
  })
})
