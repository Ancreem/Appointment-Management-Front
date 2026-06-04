/**
 * LoadingSpinner — centered MUI CircularProgress.
 */
import { Box, CircularProgress } from '@mui/material'

interface LoadingSpinnerProps {
  size?: number
  minHeight?: number
}

export function LoadingSpinner({ size = 40, minHeight = 200 }: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  )
}
