import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Project } from './projectsData'

type ProjectDetailModalProps = {
  open: boolean
  project: Project | null
  onClose: () => void
  onExited?: () => void
}

export function ProjectDetailModal({
  open,
  project,
  onClose,
  onExited,
}: ProjectDetailModalProps) {
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

  const progress = project
    ? Math.min(100, Math.max(0, project.progress))
    : 0

  return createPortal(
    <AnimatePresence onExitComplete={onExited}>
      {open && project ? (
        <motion.div
          key={project.id}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
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
            aria-labelledby="project-modal-title"
            className="relative z-10 max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-wn-border/85 bg-wn-surface/70 p-5 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.65),0_0_48px_-12px_rgba(192,132,252,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/5 backdrop-blur-xl md:p-6"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-wn-accent/12 via-transparent to-sky-500/10" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-wn-accent/15 blur-3xl" />

            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span
                  className={[
                    'inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold',
                    project.status === 'completed'
                      ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200/90'
                      : 'border-sky-500/30 bg-sky-500/10 text-sky-200/90',
                  ].join(' ')}
                >
                  {project.status === 'completed' ? 'Completed' : 'Active'}
                </span>
                <h2
                  id="project-modal-title"
                  className="mt-2 text-xl font-bold tracking-tight text-wn-text"
                >
                  {project.name}
                </h2>
              </div>
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

            <p className="relative mt-4 text-sm leading-relaxed text-wn-muted">
              {project.description}
            </p>

            <div className="relative mt-6">
              <div className="mb-1.5 flex items-center justify-between text-xs text-wn-muted">
                <span>Progress</span>
                <span className="font-semibold tabular-nums text-wn-text">
                  {progress}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full border border-wn-border/60 bg-wn-bg/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-wn-accent/90 via-wn-accent/70 to-sky-400/80 shadow-[0_0_16px_-4px_rgba(192,132,252,0.55)] transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="relative mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-xl border border-wn-border/70 bg-wn-bg/35 px-3 py-2 text-wn-muted">
                <span className="font-semibold tabular-nums text-wn-text">
                  {project.taskCount}
                </span>{' '}
                tasks
              </span>
            </div>

            <div className="relative mt-6 border-t border-wn-border/60 pt-5">
              <p className="text-xs font-semibold tracking-wide text-wn-muted uppercase">
                Team members
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex -space-x-2" aria-label="Member avatars">
                  {project.members.map((m, i) => (
                    <span
                      key={`${project.id}-m-${i}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-wn-surface/95 bg-wn-elevated/90 text-xs font-semibold text-wn-text shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_16px_-6px_rgba(192,132,252,0.3)]"
                      title={m.initials}
                    >
                      {m.initials}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-wn-muted">
                  {project.members.length}{' '}
                  {project.members.length === 1 ? 'member' : 'members'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    node,
  )
}
