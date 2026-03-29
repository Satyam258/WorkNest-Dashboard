import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ease = [0.22, 1, 0.36, 1] as const

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  const p = parts[0] ?? '?'
  return p.slice(0, 2).toUpperCase()
}

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const handleLogout = useCallback(() => {
    setOpen(false)
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  if (!user) return null

  const initials = initialsFromName(user.name)

  return (
    <div ref={rootRef} className="relative">
      <motion.button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-wn-accent/35 to-wn-accent/10 ring-2 ring-wn-border/90 shadow-[0_0_20px_-6px_var(--color-wn-accent-glow)] transition-all duration-200 hover:ring-wn-accent/35 hover:shadow-[0_0_28px_-4px_rgba(192,132,252,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]"
        aria-expanded={open ? 'true' : 'false'}
        aria-haspopup="menu"
        aria-label="Account menu"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-xs font-semibold text-wn-text">{initials}</span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.22, ease }}
            className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-wn-border/85 bg-wn-surface/95 py-1 shadow-[0_20px_48px_-12px_rgba(0,0,0,0.55),0_0_32px_-12px_rgba(192,132,252,0.12)] ring-1 ring-white/6 backdrop-blur-xl"
          >
            <div className="border-b border-wn-border/60 px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-wn-text">
                {user.name}
              </p>
              <p className="truncate text-xs text-wn-muted">{user.email}</p>
            </div>
            <button
              type="button"
              role="menuitem"
              className="flex w-full px-3 py-2.5 text-left text-sm text-wn-muted transition-colors duration-200 hover:bg-white/5 hover:text-wn-text"
              onClick={handleLogout}
            >
              Log out
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
