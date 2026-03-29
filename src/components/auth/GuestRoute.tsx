import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, isReady } = useAuth()

  if (!isReady) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-wn-bg text-wn-muted">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-wn-border border-t-wn-accent" />
      </div>
    )
  }

  /* Logged-in users skip auth screens and land on the app dashboard */
  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
