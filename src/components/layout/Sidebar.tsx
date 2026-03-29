import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const nav: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/settings', label: 'Settings' },
]

type SidebarProps = {
  mobileOpen: boolean
  onNavigate?: () => void
  isDesktop: boolean
}

export function Sidebar({ mobileOpen, onNavigate, isDesktop }: SidebarProps) {
  const x = isDesktop ? 0 : mobileOpen ? 0 : '-100%'

  return (
    <motion.aside
      initial={false}
      animate={{ x }}
      transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      className="fixed top-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col border-r border-wn-border/80 bg-wn-bg/95 shadow-[4px_0_32px_-16px_rgba(0,0,0,0.55),1px_0_0_rgba(192,132,252,0.1),inset_-1px_0_0_rgba(192,132,252,0.07)] backdrop-blur-md md:relative md:z-0"
      style={{ willChange: 'transform' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-wn-surface/50 via-transparent to-wn-bg/90" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_0%_-20%,rgba(192,132,252,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_100%_100%,rgba(99,102,241,0.06),transparent_50%)]" />

      <div className="relative flex h-16 items-center gap-2 border-b border-wn-border/80 px-5 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-wn-accent/25 to-wn-accent/5 ring-1 ring-wn-accent/30 shadow-[0_0_24px_-4px_var(--color-wn-accent-glow)]"
          aria-hidden
        >
          <span className="text-lg font-semibold text-wn-accent">W</span>
        </div>
        <span className="text-lg font-semibold tracking-tight text-wn-text">
          WorkNest
        </span>
      </div>

      <nav className="relative flex flex-1 flex-col gap-1.5 p-3" aria-label="Main">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end ?? false}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              [
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'text-wn-text'
                  : 'text-wn-muted hover:text-wn-text',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-[rgba(192,132,252,0.2)] ring-1 ring-wn-accent/40 shadow-[0_0_32px_-6px_rgba(192,132,252,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]"
                    transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                  />
                )}
                <span
                  className={[
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-lg ring-1 transition-[box-shadow,transform,background-color] md:group-hover:scale-[1.02]',
                    isActive
                      ? 'bg-wn-elevated/90 ring-wn-accent/25 shadow-[0_0_14px_-4px_rgba(192,132,252,0.35)]'
                      : 'bg-wn-surface/80 ring-wn-border/80 group-hover:bg-wn-elevated/70 group-hover:shadow-[0_0_16px_-6px_var(--color-wn-accent-glow)] group-hover:ring-wn-accent/20',
                  ].join(' ')}
                >
                  <NavGlyph name={item.label} active={isActive} />
                </span>
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative border-t border-wn-border/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <p className="text-xs text-wn-muted/90">
          Layout preview — charts and boards come later.
        </p>
      </div>
    </motion.aside>
  )
}

function NavGlyph({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? 'var(--color-wn-accent)' : 'currentColor'
  const className = 'h-4 w-4'
  switch (name) {
    case 'Dashboard':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
          />
        </svg>
      )
    case 'Projects':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
          />
          <path
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            d="M8 11h8M8 15h5"
          />
        </svg>
      )
    case 'Tasks':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 11l3 3L22 4"
          />
          <path
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
          />
        </svg>
      )
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          />
          <path
            stroke={stroke}
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"
          />
        </svg>
      )
  }
}
