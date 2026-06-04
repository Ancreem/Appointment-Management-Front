/**
 * Root component — delegates entirely to AppRouter.
 * AuthProvider and all global providers live in main.tsx.
 */
import { AppRouter } from '@/routes/AppRouter'

export default function App() {
  return <AppRouter />
}
