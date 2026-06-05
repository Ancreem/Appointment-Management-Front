import { Card, CardContent, Skeleton } from '@mui/material'

export function StatCardSkeleton() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Skeleton animation="wave" variant="text" width="50%" height={20} sx={{ mb: 1 }} />
        <Skeleton animation="wave" variant="text" width="30%" height={48} />
      </CardContent>
    </Card>
  )
}
