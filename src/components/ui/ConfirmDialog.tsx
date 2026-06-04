/**
 * ConfirmDialog — reusable confirmation dialog with optional loading state.
 */
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmColor?: 'error' | 'primary'
  confirmLoading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmColor = 'error',
  confirmLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={confirmLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={confirmLoading}
          startIcon={confirmLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
