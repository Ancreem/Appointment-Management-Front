/**
 * DashboardPage — welcome card + summary stats for the authenticated user.
 *
 * Fetches appointment counts grouped by status using three parallel calls
 * through useAppointments so each stat shows the correct filtered total.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { appointmentsApi } from '@/api/appointments.api'
import { useAuthContext } from '@/context/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Stats {
  total: number
  scheduled: number
  confirmed: number
}

export default function DashboardPage() {
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      setLoading(true)
      setError(null)
      try {
        const [all, scheduled, confirmed] = await Promise.all([
          appointmentsApi.getAll({ page: 0, size: 1 }),
          appointmentsApi.getAll({ page: 0, size: 1, status: 'SCHEDULED' }),
          appointmentsApi.getAll({ page: 0, size: 1, status: 'CONFIRMED' }),
        ])
        if (!cancelled) {
          setStats({
            total: all.totalElements,
            scheduled: scheduled.totalElements,
            confirmed: confirmed.totalElements,
          })
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load dashboard statistics.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadStats()
    return () => { cancelled = true }
  }, [])

  const displayName = user?.userId ?? 'there'

  return (
    <Box>
      {/* Welcome banner */}
      <Paper
        variant="outlined"
        sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Welcome back, {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's a quick overview of your appointments.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/appointments/new')}
        >
          New Appointment
        </Button>
      </Paper>

      {/* Stats section */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <StatCard label="Total Appointments" value={stats?.total ?? 0} color="primary.main" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard label="Upcoming (Scheduled)" value={stats?.scheduled ?? 0} color="warning.main" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard label="Confirmed" value={stats?.confirmed ?? 0} color="success.main" />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Sub-component: single stat card
// ---------------------------------------------------------------------------
interface StatCardProps {
  label: string
  value: number
  color: string
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h3" fontWeight={700} sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}
