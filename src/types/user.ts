/**
 * User type definitions.
 */

import type { UserRole } from './auth'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
}
