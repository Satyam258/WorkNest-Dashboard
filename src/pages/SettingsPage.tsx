import { motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { AuthPasswordField } from '../components/auth/AuthPasswordField'
import { AUTH_LABEL, authInputClassName } from '../components/auth/authFieldStyles'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'

const ease = [0.22, 1, 0.36, 1] as const

const glassPanel =
  'relative overflow-hidden rounded-2xl border border-wn-border/85 bg-wn-surface/55 p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.45),0_16px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/4 md:p-6'

const sectionTitle = 'text-base font-semibold tracking-tight text-wn-text'
const sectionDesc = 'mt-1 text-sm text-wn-muted'

function SectionShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className={glassPanel}>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/3 via-transparent to-wn-accent/5" />
      <div className="relative">
        <h2 className={sectionTitle}>{title}</h2>
        <p className={sectionDesc}>{description}</p>
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </section>
  )
}

export function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  const darkMode = theme === 'dark'

  useEffect(() => {
    setName(user?.name ?? '')
    setEmail(user?.email ?? '')
  }, [user?.name, user?.email])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(name, email)
    toast({ message: 'Profile saved', tone: 'success' })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 md:space-y-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold tracking-wide text-wn-accent uppercase">
          Workspace
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-wn-text md:text-xl">
          Settings
        </h2>
        <p className="text-sm leading-relaxed text-wn-muted">
          Account, theme, and security — stored locally in this preview.
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
        className="space-y-6"
      >
        <SectionShell
          title="Profile"
          description="How you appear in WorkNest."
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label htmlFor="settings-name" className={AUTH_LABEL}>
                Name
              </label>
              <input
                id="settings-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-1.5 ${authInputClassName(false)}`}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="settings-email" className={AUTH_LABEL}>
                Email
              </label>
              <input
                id="settings-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1.5 ${authInputClassName(false)}`}
                placeholder="you@company.com"
              />
            </div>
            <motion.button
              type="submit"
              className="rounded-xl border border-wn-accent/40 bg-linear-to-r from-wn-accent/25 to-sky-500/15 px-4 py-2.5 text-sm font-semibold text-wn-text shadow-[0_0_24px_-10px_rgba(192,132,252,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[box-shadow,border-color] duration-200 hover:border-wn-accent/55 hover:shadow-[0_0_32px_-8px_rgba(192,132,252,0.55)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease }}
            >
              Save changes
            </motion.button>
          </form>
        </SectionShell>

        <SectionShell
          title="Appearance"
          description="Light or dark — preference is remembered on this device."
        >
          <div className="flex items-center justify-between gap-4 rounded-xl border border-wn-border/60 bg-wn-bg/30 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div id="settings-dark-mode-label">
              <p className="text-sm font-medium text-wn-text">Dark mode</p>
              <p className="mt-0.5 text-xs text-wn-muted">
                Applies across the app with a smooth transition.
              </p>
            </div>
            <label
              htmlFor="settings-dark-mode"
              className={[
                'relative inline-flex h-8 w-13 shrink-0 cursor-pointer rounded-full border transition-[background-color,box-shadow,border-color] duration-300',
                darkMode
                  ? 'border-wn-accent/45 bg-wn-accent/35 shadow-[0_0_24px_-8px_rgba(192,132,252,0.55),inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'border-wn-border/70 bg-wn-elevated/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]',
              ].join(' ')}
            >
              <input
                id="settings-dark-mode"
                type="checkbox"
                role="switch"
                checked={darkMode}
                onChange={(e) => {
                  const next = e.target.checked ? 'dark' : 'light'
                  setTheme(next)
                  toast({
                    message:
                      next === 'dark' ? 'Dark theme enabled' : 'Light theme enabled',
                  })
                }}
                aria-labelledby="settings-dark-mode-label"
                className="peer sr-only"
              />
              <motion.span
                aria-hidden
                className={[
                  'pointer-events-none absolute top-1/2 left-1 h-6 w-6 -translate-y-1/2 rounded-full border shadow-md',
                  darkMode
                    ? 'border-white/20 bg-white/95'
                    : 'border-wn-border/80 bg-wn-surface/90',
                ].join(' ')}
                initial={false}
                animate={{ x: darkMode ? 22 : 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 420 }}
              />
            </label>
          </div>
        </SectionShell>

        <SectionShell
          title="Security"
          description="Change password — fields are for layout only."
        >
          <div className="space-y-4">
            <AuthPasswordField
              id="settings-current-password"
              label="Current password"
              value={currentPw}
              onChange={setCurrentPw}
              autoComplete="current-password"
            />
            <AuthPasswordField
              id="settings-new-password"
              label="New password"
              value={newPw}
              onChange={setNewPw}
              autoComplete="new-password"
            />
            <AuthPasswordField
              id="settings-confirm-password"
              label="Confirm new password"
              value={confirmPw}
              onChange={setConfirmPw}
              autoComplete="new-password"
            />
            <p className="text-xs text-wn-muted/90">
              Password updates are not sent anywhere in this demo.
            </p>
            <motion.button
              type="button"
              className="rounded-xl border border-wn-border/75 bg-wn-elevated/50 px-4 py-2.5 text-sm font-semibold text-wn-text shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[border-color,box-shadow,background-color] duration-200 hover:border-wn-accent/35 hover:bg-wn-elevated/70 hover:shadow-[0_0_22px_-10px_rgba(192,132,252,0.2)]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease }}
              onClick={() =>
                toast({
                  message: 'Password change is preview-only (no server)',
                  tone: 'warning',
                })
              }
            >
              Update password
            </motion.button>
          </div>
        </SectionShell>
      </motion.div>
    </div>
  )
}
