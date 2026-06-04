/**
 * AuthLayout — centered card shell for unauthenticated pages (login).
 */
import { type PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

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
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography variant="h5" component="h1" align="center" fontWeight={700}>
          Appointment Manager
        </Typography>

        {children}
      </Paper>
    </Box>
  )
}
