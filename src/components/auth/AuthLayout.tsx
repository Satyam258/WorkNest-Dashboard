import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-wn-bg px-4 py-10 text-wn-muted">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(147,51,234,0.08),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(192,132,252,0.14),transparent)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(99,102,241,0.05),transparent)] dark:bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(99,102,241,0.08),transparent)]" />

      <div className="relative mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-wn-accent/30 to-wn-accent/10 ring-1 ring-wn-accent/35 shadow-[0_0_28px_-8px_rgba(192,132,252,0.45)]">
          <span className="text-lg font-bold text-wn-accent">W</span>
        </div>
        <span className="text-xl font-semibold tracking-tight text-wn-text">
          WorkNest
        </span>
      </div>

      {children}

      <p className="relative mt-8 max-w-sm text-center text-xs text-wn-muted/80">
        Frontend-only auth — credentials are not sent anywhere.
      </p>
    </div>
  )
}
