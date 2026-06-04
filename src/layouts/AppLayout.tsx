/**
 * AppLayout — main shell with AppBar, navigation, and outlet.
 * Implemented fully in Stage 6 (T-54). Placeholder establishes module.
 */
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
