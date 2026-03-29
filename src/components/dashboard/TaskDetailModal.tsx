import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTasks } from '../../contexts/TasksContext'
import { useToast } from '../../contexts/ToastContext'
import { GlassMenuSelect } from '../projects/GlassMenuSelect'
import { PriorityBadge } from '../tasks/PriorityBadge'
import {
  kanbanColumns,
  type KanbanColumnId,
  type KanbanPriority,
} from './kanbanData'

const priorityOptions: { value: KanbanPriority; label: string }[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]

type TaskDetailModalProps = {
  open: boolean
  taskId: string | null
  onClose: () => void
  onExited?: () => void
}

export function TaskDetailModal({
  open,
  taskId,
  onClose,
  onExited,
}: TaskDetailModalProps) {
  const { tasks, updateTask } = useTasks()
  const { toast } = useToast()

  const task = useMemo(
    () => (taskId ? tasks.find((t) => t.id === taskId) ?? null : null),
    [taskId, tasks],
  )

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

  return createPortal(
    <AnimatePresence onExitComplete={onExited}>
      {open && task ? (
        <motion.div
          key={task.id}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="relative z-10 max-h-[min(90dvh,720px)] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-2xl border border-wn-border/85 bg-wn-surface/70 p-5 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.65),0_0_48px_-12px_rgba(192,132,252,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/5 backdrop-blur-xl md:p-6"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-wn-accent/12 via-transparent to-sky-500/10" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-wn-accent/15 blur-3xl" />

            <div className="relative flex items-start justify-between gap-3">
              <h2
                id="task-modal-title"
                className="text-lg font-bold tracking-tight text-wn-text md:text-xl"
              >
                {task.title}
              </h2>
              <motion.button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-wn-border/70 bg-wn-bg/40 text-wn-muted transition-[color,background-color,border-color,box-shadow] duration-200 hover:border-wn-accent/35 hover:bg-wn-accent/10 hover:text-wn-text hover:shadow-[0_0_20px_-8px_rgba(192,132,252,0.35)]"
                aria-label="Close"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.2 }}
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
              </motion.button>
            </div>

            <p className="relative mt-3 text-sm leading-relaxed text-wn-muted">
              {task.description}
            </p>

            <div className="relative mt-5 flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} size="md" />
              {task.dueDate ? (
                <span className="inline-flex rounded-lg border border-wn-border/70 bg-wn-bg/35 px-2.5 py-1 text-xs font-medium text-wn-muted">
                  Due {task.dueDate}
                </span>
              ) : (
                <span className="inline-flex rounded-lg border border-wn-border/60 bg-wn-bg/25 px-2.5 py-1 text-xs font-medium text-wn-muted/80">
                  No due date
                </span>
              )}
            </div>

            <div className="relative mt-5 flex items-center gap-3 rounded-xl border border-wn-border/60 bg-wn-bg/30 p-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-wn-border/70 bg-wn-elevated/80 text-xs font-semibold text-wn-text shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_-8px_var(--color-wn-accent-glow)]">
                {task.initials}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-wn-muted">Assignee</p>
                <p className="truncate text-sm font-semibold text-wn-text">
                  {task.assigneeName}
                </p>
              </div>
            </div>

            <div className="relative mt-6 space-y-4 border-t border-wn-border/60 pt-5 pb-1">
              <p className="text-xs font-semibold tracking-wide text-wn-muted uppercase">
                Update task
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <GlassMenuSelect<KanbanColumnId>
                  label="Status"
                  value={task.column}
                  menuPortal
                  onChange={(column) => {
                    updateTask(task.id, { column })
                    toast({
                      message: 'Status updated',
                      tone: 'success',
                    })
                  }}
                  options={kanbanColumns.map((c) => ({
                    value: c.id,
                    label: c.title,
                  }))}
                />
                <GlassMenuSelect<KanbanPriority>
                  label="Priority"
                  value={task.priority}
                  menuPortal
                  onChange={(priority) => {
                    updateTask(task.id, { priority })
                    toast({
                      message: 'Priority updated',
                      tone: 'success',
                    })
                  }}
                  options={priorityOptions}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    node,
  )
}
