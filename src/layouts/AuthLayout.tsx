/**
 * AuthLayout — centered card shell for unauthenticated pages (login).
 * Implemented fully in Stage 6 (T-54). Placeholder establishes module.
 */
import { type PropsWithChildren } from 'react'
import Box from '@mui/material/Box'

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      {children}
    </Box>
  )
}
