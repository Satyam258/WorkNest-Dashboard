import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ProjectStatus } from './projectsData'

const ease = [0.22, 1, 0.36, 1] as const

type CreateProjectModalProps = {
  open: boolean
  onClose: () => void
  onExited?: () => void
  onCreate: (payload: {
    name: string
    description: string
    status: ProjectStatus
  }) => void
}

export function CreateProjectModal({
  open,
  onClose,
  onExited,
  onCreate,
}: CreateProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('active')
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setName('')
    setDescription('')
    setStatus('active')
    setError(null)
  }, [])

  useEffect(() => {
    if (open) reset()
  }, [open, reset])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prev
    }
  }, [open, handleKeyDown])

  const node = typeof document !== 'undefined' ? document.body : null
  if (!node) return null

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-wn-border/70 bg-wn-bg/45 px-3 py-2.5 text-sm text-wn-text shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-wn-muted/60 focus:border-wn-accent/45 focus:shadow-[0_0_0_1px_rgba(192,132,252,0.2),0_0_20px_-10px_rgba(192,132,252,0.2)]'

  const submit = () => {
    const n = name.trim()
    if (!n) {
      setError('Add a project name to continue.')
      return
    }
    setError(null)
    onCreate({
      name: n,
      description: description.trim(),
      status,
    })
    onClose()
  }

  return createPortal(
    <AnimatePresence onExitComplete={onExited}>
      {open ? (
        <motion.div
          key="create-project"
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease }}
        >
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/55 backdrop-blur-md transition-opacity duration-200"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
            className="relative z-10 max-h-[min(90vh,640px)] w-full max-w-md overflow-y-auto rounded-2xl border border-wn-border/85 bg-wn-surface/72 p-5 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.65),0_0_48px_-12px_rgba(192,132,252,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/5 backdrop-blur-xl md:p-6"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-wn-accent/10 via-transparent to-sky-500/8" />

            <div className="relative flex items-start justify-between gap-3">
              <h2
                id="create-project-title"
                className="text-lg font-bold tracking-tight text-wn-text md:text-xl"
              >
                New project
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-wn-border/70 bg-wn-bg/40 text-wn-muted transition-all duration-200 hover:border-wn-accent/35 hover:bg-wn-accent/10 hover:text-wn-text hover:shadow-[0_0_20px_-8px_rgba(192,132,252,0.35)]"
                aria-label="Close"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              </button>
            </div>

            <p className="relative mt-2 text-sm text-wn-muted">
              All fields stay in the browser — no API calls.
            </p>

            <div className="relative mt-5 space-y-4">
              <label className="block text-xs font-medium text-wn-muted">
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (error) setError(null)
                  }}
                  className={inputClass}
                  placeholder="e.g. Q2 onboarding"
                  autoComplete="off"
                />
              </label>

              <label className="block text-xs font-medium text-wn-muted">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="What is this project about?"
                />
              </label>

              <div>
                <span className="text-xs font-medium text-wn-muted">Status</span>
                <div className="mt-1.5 flex gap-1 rounded-xl border border-wn-border/70 bg-wn-bg/30 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]">
                  {(
                    [
                      { value: 'active' as const, label: 'Active' },
                      { value: 'completed' as const, label: 'Completed' },
                    ] as const
                  ).map((opt) => {
                    const on = status === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={[
                          'flex-1 rounded-lg py-2 text-center text-sm font-medium transition-all duration-200',
                          on
                            ? 'bg-wn-accent/20 text-wn-text shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_-10px_rgba(192,132,252,0.35)]'
                            : 'text-wn-muted hover:bg-white/5 hover:text-wn-text',
                        ].join(' ')}
                        onClick={() => setStatus(opt.value)}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {error ? (
                <p className="text-xs font-medium text-amber-200/90 transition-opacity duration-200">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="relative mt-6 flex flex-wrap justify-end gap-2 border-t border-wn-border/60 pt-5">
              <motion.button
                type="button"
                className="rounded-xl border border-wn-border/70 bg-wn-bg/35 px-4 py-2.5 text-sm font-medium text-wn-muted transition-all duration-200 hover:border-wn-border hover:bg-wn-elevated/50 hover:text-wn-text"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease }}
                onClick={onClose}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                className="rounded-xl border border-wn-accent/40 bg-linear-to-r from-wn-accent/25 to-sky-500/15 px-4 py-2.5 text-sm font-semibold text-wn-text shadow-[0_0_24px_-10px_rgba(192,132,252,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:border-wn-accent/55 hover:shadow-[0_0_32px_-8px_rgba(192,132,252,0.5)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease }}
                onClick={submit}
              >
                Create
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    node,
  )
}
