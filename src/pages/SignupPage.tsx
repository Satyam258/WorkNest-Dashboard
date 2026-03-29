import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthPasswordField } from '../components/auth/AuthPasswordField'
import {
  AUTH_FIELD_ERROR,
  AUTH_LABEL,
  AUTH_SUBMIT,
  authInputClassName,
} from '../components/auth/authFieldStyles'
import { useAuth } from '../contexts/AuthContext'

const ease = [0.22, 1, 0.36, 1] as const

export function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from?.trim() || '/'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
  }>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Name is required'
    if (!email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address'
    }
    if (!password) next.password = 'Password is required'
    else if (password.length < 6)
      next.password = 'Use at least 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await signup(name.trim(), email.trim(), password)
      navigate(from, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  const nameErr = Boolean(errors.name)
  const emailErr = Boolean(errors.email)

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease }}
        className="relative w-full max-w-md rounded-2xl border border-wn-border/85 bg-wn-surface/60 p-6 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.65),0_0_40px_-12px_rgba(192,132,252,0.15),inset_0_1px_0_rgba(255,255,255,0.07)] ring-1 ring-white/5 backdrop-blur-xl md:p-8"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-wn-accent/10 via-transparent to-sky-500/8" />

        <div className="relative">
          <h1 className="text-xl font-bold tracking-tight text-wn-text md:text-2xl">
            Create account
          </h1>
          <p className="mt-1 text-sm text-wn-muted">
            Start a new workspace in seconds.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="signup-name" className={AUTH_LABEL}>
                Name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((x) => ({ ...x, name: undefined }))
                }}
                {...(nameErr ? { 'aria-invalid': true } : {})}
                aria-describedby={nameErr ? 'signup-name-error' : undefined}
                className={`mt-1.5 ${authInputClassName(nameErr)}`}
                placeholder="Alex Rivera"
              />
              {errors.name ? (
                <p
                  id="signup-name-error"
                  className={AUTH_FIELD_ERROR}
                  role="alert"
                >
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="signup-email" className={AUTH_LABEL}>
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((x) => ({ ...x, email: undefined }))
                }}
                {...(emailErr ? { 'aria-invalid': true } : {})}
                aria-describedby={emailErr ? 'signup-email-error' : undefined}
                className={`mt-1.5 ${authInputClassName(emailErr)}`}
                placeholder="you@company.com"
              />
              {errors.email ? (
                <p
                  id="signup-email-error"
                  className={AUTH_FIELD_ERROR}
                  role="alert"
                >
                  {errors.email}
                </p>
              ) : null}
            </div>

            <AuthPasswordField
              id="signup-password"
              label="Password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              autoComplete="new-password"
              onClearError={() =>
                setErrors((x) => ({ ...x, password: undefined }))
              }
            />

            <motion.button
              type="submit"
              disabled={submitting}
              className={AUTH_SUBMIT}
              whileHover={
                submitting
                  ? undefined
                  : {
                      scale: 1.015,
                      boxShadow:
                        '0 0 48px -6px rgba(192,132,252,0.55), 0 0 28px -8px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.12)',
                    }
              }
              whileTap={submitting ? undefined : { scale: 0.99 }}
              transition={{ duration: 0.22, ease }}
            >
              {submitting ? (
                <span className="flex items-center gap-2.5">
                  <span
                    className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-wn-text/25 border-t-wn-text"
                    aria-hidden
                  />
                  <span>Creating…</span>
                </span>
              ) : (
                'Create account'
              )}
            </motion.button>
          </form>

          <p className="relative mt-6 text-center text-sm text-wn-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="font-semibold text-wn-accent transition-colors duration-200 hover:text-white"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  )
}
