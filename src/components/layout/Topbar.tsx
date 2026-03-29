import { motion } from 'framer-motion'
import { useTopSearchBinding } from '../../hooks/useTopSearchBinding'
import { UserMenu } from './UserMenu'

type TopbarProps = {
  onMenuClick: () => void
  title?: string
}

export function Topbar({ onMenuClick, title = 'Dashboard' }: TopbarProps) {
  const { value: searchValue, onChange: onSearchChange, placeholder } =
    useTopSearchBinding()
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-wn-border/80 bg-wn-bg/85 px-4 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md md:px-6">
      <motion.button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-wn-border/80 bg-wn-surface/55 text-wn-text shadow-sm transition-all duration-200 hover:border-wn-border hover:bg-wn-elevated/75 hover:text-wn-text hover:shadow-[0_0_22px_-8px_var(--color-wn-accent-glow),inset_0_1px_0_rgba(255,255,255,0.05)] md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
        whileTap={{ scale: 0.96 }}
      >
        <MenuIcon />
      </motion.button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold tracking-tight text-wn-text md:text-lg">
          {title}
        </h1>
      </div>

      <div className="relative hidden max-w-xs flex-1 md:block md:max-w-md">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-wn-muted">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-2xl border border-wn-border/70 bg-wn-elevated/75 py-2 pr-3 pl-10 text-sm text-wn-text shadow-[inset_0_1px_3px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.04)] placeholder:text-wn-muted/70 outline-none ring-0 transition-[box-shadow,border-color,background-color] duration-200 focus:border-wn-accent/45 focus:bg-wn-elevated/90 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.35),0_0_0_1px_rgba(192,132,252,0.2),0_0_28px_-10px_var(--color-wn-accent-glow)]"
        />
      </div>

      <motion.button
        type="button"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-wn-border/80 bg-wn-surface/55 text-wn-muted transition-all duration-200 hover:border-wn-border hover:bg-wn-elevated/75 hover:text-wn-text hover:shadow-[0_0_22px_-8px_var(--color-wn-accent-glow),inset_0_1px_0_rgba(255,255,255,0.05)]"
        aria-label="Notifications"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <BellIcon />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-wn-accent shadow-[0_0_10px_var(--color-wn-accent-glow)]" />
      </motion.button>

      <UserMenu />
    </header>
  )
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M5 7h14M5 12h14M5 17h14"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
      />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M13.73 21a2 2 0 0 1-3.46 0"
      />
    </svg>
  )
}
