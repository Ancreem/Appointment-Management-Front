import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserTable } from './UserTable'
import type { User } from '@/types/user'

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'ADMIN' },
  { id: '2', name: 'Regular User', email: 'user@test.com', role: 'USER' },
]

describe('UserTable', () => {
  it('renders user rows', () => {
    render(<UserTable users={mockUsers} />)
    expect(screen.getByText('Admin User')).toBeInTheDocument()
    expect(screen.getByText('admin@test.com')).toBeInTheDocument()
    expect(screen.getByText('Regular User')).toBeInTheDocument()
    expect(screen.getByText('user@test.com')).toBeInTheDocument()
  })

  it('renders role chips', () => {
    render(<UserTable users={mockUsers} />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('shows skeleton when loading', () => {
    const { container } = render(<UserTable users={[]} loading />)
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument()
  })

  it('shows empty state when no users', () => {
    render(<UserTable users={[]} />)
    expect(screen.getByText('No users found')).toBeInTheDocument()
  })
})
