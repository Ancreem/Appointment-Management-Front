import { AuthProvider } from './context/AuthContext'
import { AppRouter } from './routes/AppRouter'

/**
 * Root component.
 * Wraps the entire application in the AuthProvider so every route
 * can access authentication state via the useAuth hook.
 * Routing is delegated to AppRouter.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
