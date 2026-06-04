/**
 * EmptyState — centered icon + title + optional subtitle.
 */
import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  subtitle?: string
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        gap: 1,
        color: 'text.secondary',
      }}
    >
      {icon && (
        <Box sx={{ mb: 1, fontSize: 48, display: 'flex' }}>{icon}</Box>
      )}
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.disabled">
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}
