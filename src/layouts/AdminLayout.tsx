import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { useCallback, useMemo, useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'
import { ProjectsBrowseProvider } from '../contexts/ProjectsBrowseContext'
import { useTopSearchBinding } from '../hooks/useTopSearchBinding'
import { useMediaQuery } from '../hooks/useMediaQuery'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/settings': 'Settings',
}

function MobileWorkspaceSearch() {
  const { value, onChange, placeholder } = useTopSearchBinding()
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-wn-muted">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
          />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-2xl border border-wn-border/70 bg-wn-elevated/75 py-2 pr-3 pl-10 text-sm text-wn-text shadow-[inset_0_1px_3px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.04)] placeholder:text-wn-muted/70 outline-none transition-[box-shadow,border-color,background-color] duration-200 focus:border-wn-accent/45 focus:bg-wn-elevated/90 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.35),0_0_0_1px_rgba(192,132,252,0.2),0_0_28px_-10px_var(--color-wn-accent-glow)]"
      />
    </div>
  )
}

export function AdminLayout() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), [])

  const title = useMemo(() => {
    const path = location.pathname
    return titles[path] ?? 'WorkNest'
  }, [location.pathname])

  return (
    <div className="relative flex min-h-svh bg-wn-bg text-wn-muted">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(192,132,252,0.12),transparent)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(99,102,241,0.06),transparent)]" />

      <AnimatePresence>
        {!isDesktop && mobileOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/55 backdrop-blur-[2px] md:hidden"
            aria-label="Close menu"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex min-h-svh w-full">
        <Sidebar
          mobileOpen={mobileOpen}
          onNavigate={closeMobile}
          isDesktop={isDesktop}
        />

        <ProjectsBrowseProvider>
          <div className="relative flex min-w-0 flex-1 flex-col shadow-[inset_1px_0_0_rgba(255,255,255,0.02)]">
            <Topbar onMenuClick={toggleMobile} title={title} />

            <div className="md:hidden border-b border-wn-border/80 bg-wn-bg/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-sm">
              <MobileWorkspaceSearch />
            </div>

            <main className="relative flex-1 overflow-auto p-5 md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-wn-accent/5 via-transparent to-wn-surface/6" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(192,132,252,0.06),transparent_65%)]" />
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto max-w-6xl"
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
        </ProjectsBrowseProvider>
      </div>
    </div>
  )
}
