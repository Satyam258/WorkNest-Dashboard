import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function RequireAuth() {
  const { user, isReady } = useAuth()
  const location = useLocation()

  if (!isReady) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-wn-bg text-wn-muted">
        <div className="flex flex-col items-center gap-3">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-wn-border border-t-wn-accent" />
          <p className="text-sm text-wn-muted">Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
