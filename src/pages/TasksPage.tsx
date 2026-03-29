import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { TaskDetailModal } from '../components/dashboard/TaskDetailModal'
import {
  kanbanColumns,
  type KanbanColumnId,
  type KanbanTask,
} from '../components/dashboard/kanbanData'
import { GlassMenuSelect } from '../components/projects/GlassMenuSelect'
import { PriorityBadge } from '../components/tasks/PriorityBadge'
import { useTasks } from '../contexts/TasksContext'
import { useProjectsBrowse } from '../contexts/ProjectsBrowseContext'

const ease = [0.22, 1, 0.36, 1] as const

type StatusFilter = 'all' | KanbanColumnId

const statusFilterOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  ...kanbanColumns.map((c) => ({ value: c.id, label: c.title })),
]

function statusLabel(column: KanbanColumnId): string {
  return kanbanColumns.find((c) => c.id === column)?.title ?? column
}

function StatusBadge({ column }: { column: KanbanColumnId }) {
  const tone: Record<KanbanColumnId, string> = {
    todo: 'border-sky-400/30 bg-sky-500/12 text-sky-100/95',
    in_progress:
      'border-wn-accent/35 bg-wn-accent/14 text-wn-text shadow-[0_0_14px_-6px_rgba(192,132,252,0.35)]',
    done: 'border-emerald-400/35 bg-emerald-500/12 text-emerald-100/95',
  }
  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-0.5 text-xs font-medium ${tone[column]}`}
    >
      {statusLabel(column)}
    </span>
  )
}

export function TasksPage() {
  const { tasks } = useTasks()
  const browse = useProjectsBrowse()
  const search = browse?.tasksSearchQuery ?? ''
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTaskId, setModalTaskId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks.filter((t: KanbanTask) => {
      if (statusFilter !== 'all' && t.column !== statusFilter) return false
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tag.toLowerCase().includes(q) ||
        t.assigneeName.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q)
      )
    })
  }, [tasks, search, statusFilter])

  const noMatches = filtered.length === 0

  const openRow = (id: string) => {
    setModalTaskId(id)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-wn-accent uppercase">
            Workspace
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-wn-text md:text-xl">
            All tasks
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-wn-muted">
            Synced with the dashboard board. Open a row to edit status and
            priority; search from here or the top bar.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <GlassMenuSelect<StatusFilter>
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusFilterOptions}
            minWidthClass="sm:min-w-[180px]"
          />
          <div className="relative w-full sm:max-w-xs lg:max-w-md">
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
              value={search}
              onChange={(e) => browse?.setTasksSearchQuery(e.target.value)}
              placeholder="Search tasks…"
              aria-label="Search tasks"
              className="h-10 w-full rounded-xl border border-wn-border/70 bg-wn-elevated/75 py-2 pr-3 pl-10 text-sm text-wn-text shadow-[inset_0_1px_3px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.04)] placeholder:text-wn-muted/70 outline-none transition-[box-shadow,border-color,background-color] duration-200 focus:border-wn-accent/45 focus:bg-wn-elevated/90 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.35),0_0_0_1px_rgba(192,132,252,0.2),0_0_28px_-10px_var(--color-wn-accent-glow)]"
            />
          </div>
        </div>
        <p className="text-xs text-wn-muted transition-opacity duration-200">
          <span className="font-semibold tabular-nums text-wn-text">
            {filtered.length}
          </span>{' '}
          {filtered.length === 1 ? 'task' : 'tasks'}
          {search.trim() ? (
            <span className="text-wn-muted/80"> matching search</span>
          ) : null}
        </p>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease }}
        className="relative overflow-hidden rounded-2xl border border-wn-border/85 bg-wn-surface/55 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.45),0_16px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/4"
        aria-labelledby="tasks-table-heading"
      >
        <div className="pointer-events-none absolute inset-0 bg-linear-to-tl from-wn-surface/20 via-transparent to-wn-accent/6" />

        <div className="relative border-b border-wn-border/70 px-5 py-4 md:px-6">
          <h2
            id="tasks-table-heading"
            className="text-base font-semibold tracking-tight text-wn-text"
          >
            Task list
          </h2>
          <p className="mt-0.5 text-sm text-wn-muted">
            Click a row for details — status and priority update everywhere.
          </p>
        </div>

        {noMatches ? (
          <div className="relative px-5 py-14 text-center md:px-6">
            <p className="text-sm font-medium text-wn-text">No tasks match</p>
            <p className="mt-1 text-xs text-wn-muted">
              Try another status or clear your search filters.
            </p>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-wn-border/60 text-xs font-semibold tracking-wide text-wn-muted uppercase">
                  <th scope="col" className="px-5 py-3 font-semibold md:px-6">
                    Task
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3 font-semibold">
                    Priority
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold md:px-6">
                    Due
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task, index) => (
                  <motion.tr
                    key={task.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${task.title}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.03, ease }}
                    className="cursor-pointer border-b border-wn-border/50 transition-colors duration-200 last:border-0 outline-none hover:bg-wn-elevated/30 focus-visible:bg-wn-elevated/35 focus-visible:ring-2 focus-visible:ring-wn-accent/30 focus-visible:ring-inset"
                    onClick={() => openRow(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openRow(task.id)
                      }
                    }}
                    whileHover={{
                      y: -2,
                      transition: { duration: 0.22, ease },
                    }}
                    whileTap={{ scale: 0.995 }}
                  >
                    <td className="max-w-[280px] px-5 py-3.5 align-middle md:px-6">
                      <p className="font-medium text-wn-text">{task.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-wn-muted">
                        {task.tag} · {task.assigneeName}
                      </p>
                    </td>
                    <td className="px-3 py-3.5 align-middle">
                      <StatusBadge column={task.column} />
                    </td>
                    <td className="px-3 py-3.5 align-middle">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-5 py-3.5 text-right align-middle tabular-nums text-wn-muted md:px-6">
                      {task.dueDate ?? '—'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>

      <TaskDetailModal
        open={modalOpen}
        taskId={modalTaskId}
        onClose={() => setModalOpen(false)}
        onExited={() => setModalTaskId(null)}
      />
    </div>
  )
}
