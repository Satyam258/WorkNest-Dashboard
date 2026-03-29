import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { useCallback, useMemo, useState, type CSSProperties } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { useTasks } from '../../contexts/TasksContext'
import { PriorityBadge } from '../tasks/PriorityBadge'
import {
  kanbanColumns,
  type KanbanColumnId,
  type KanbanTask,
  type KanbanTag,
} from './kanbanData'
import { TaskDetailModal } from './TaskDetailModal'

const sectionMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
}

const easeOut = [0.22, 1, 0.36, 1] as const
const cardEase = { duration: 0.26, ease: easeOut }

function columnTintClass(id: KanbanColumnId): string {
  switch (id) {
    case 'todo':
      return 'bg-linear-to-b from-sky-500/8 via-sky-500/2 to-transparent'
    case 'in_progress':
      return 'bg-linear-to-b from-wn-accent/10 via-wn-accent/3 to-transparent'
    case 'done':
      return 'bg-linear-to-b from-emerald-500/8 via-emerald-500/2 to-transparent'
    default:
      return ''
  }
}

export function KanbanBoard() {
  const { tasks, setTaskColumn } = useTasks()
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTaskId, setModalTaskId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const byColumn = useMemo(() => {
    const map: Record<KanbanColumnId, KanbanTask[]> = {
      todo: [],
      in_progress: [],
      done: [],
    }
    for (const t of tasks) {
      map[t.column].push(t)
    }
    return map
  }, [tasks])

  const resolveDropColumn = useCallback(
    (overId: string | undefined): KanbanColumnId | null => {
      if (!overId) return null
      if (kanbanColumns.some((c) => c.id === overId)) {
        return overId as KanbanColumnId
      }
      const hit = tasks.find((t) => t.id === overId)
      return hit?.column ?? null
    },
    [tasks],
  )

  const handleDragStart = useCallback(
    (e: DragStartEvent) => {
      const id = String(e.active.id)
      const t = tasks.find((x) => x.id === id)
      setActiveTask(t ?? null)
    },
    [tasks],
  )

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveTask(null)
      const { active, over } = e
      if (!over) return
      const taskId = String(active.id)
      const col = resolveDropColumn(String(over.id))
      if (!col) return
      const current = tasks.find((t) => t.id === taskId)
      if (current && current.column !== col) {
        setTaskColumn(taskId, col)
        toast({ message: 'Task moved', tone: 'success' })
      }
    },
    [resolveDropColumn, setTaskColumn, tasks, toast],
  )

  const handleDragCancel = useCallback(() => setActiveTask(null), [])

  const openTaskModal = useCallback((task: KanbanTask) => {
    setModalTaskId(task.id)
    setModalOpen(true)
  }, [])

  const closeTaskModal = useCallback(() => setModalOpen(false), [])
  const clearModalTask = useCallback(() => setModalTaskId(null), [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <motion.section
        {...sectionMotion}
        className="space-y-4 md:space-y-5"
        aria-labelledby="kanban-heading"
      >
        <div>
          <h2
            id="kanban-heading"
            className="text-base font-semibold tracking-tight text-wn-text md:text-lg"
          >
            Task board
          </h2>
          <p className="mt-1 text-sm text-wn-muted">
            Drag cards between columns — updates stay in this session.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-5 xl:gap-6">
          {kanbanColumns.map((col, colIndex) => (
            <KanbanColumn
              key={col.id}
              columnId={col.id}
              title={col.title}
              tasks={byColumn[col.id]}
              listDelay={0.05 * colIndex}
              onOpenTask={openTaskModal}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.22,1,0.36,1)' }}>
          {activeTask ? <KanbanDragPreview task={activeTask} /> : null}
        </DragOverlay>
      </motion.section>

      <TaskDetailModal
        open={modalOpen}
        taskId={modalTaskId}
        onClose={closeTaskModal}
        onExited={clearModalTask}
      />
    </DndContext>
  )
}

type ColumnProps = {
  columnId: KanbanColumnId
  title: string
  tasks: KanbanTask[]
  listDelay: number
  onOpenTask: (task: KanbanTask) => void
}

function KanbanColumn({
  columnId,
  title,
  tasks,
  listDelay,
  onOpenTask,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { type: 'column', columnId },
  })

  return (
    <div className="relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-wn-border/85 bg-wn-surface/40 p-4 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/4 md:p-5">
      <div
        className={`pointer-events-none absolute inset-0 rounded-2xl opacity-[0.85] ${columnTintClass(columnId)}`}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-b from-white/3 via-transparent to-transparent" />

      <div className="relative mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-wn-border/60 bg-wn-bg/30 text-wn-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[color,box-shadow,border-color] duration-200 ease-out hover:border-wn-accent/25 hover:text-wn-accent hover:shadow-[0_0_18px_-8px_rgba(192,132,252,0.35)]">
            <ColumnHeaderIcon columnId={columnId} />
          </span>
          <h3 className="truncate text-sm font-bold tracking-tight text-wn-text">
            {title}
          </h3>
        </div>
        <span className="rounded-full border border-wn-border/70 bg-wn-elevated/60 px-2 py-0.5 text-xs font-semibold tabular-nums text-wn-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors duration-200">
          {tasks.length}
        </span>
      </div>

      <ul
        ref={setNodeRef}
        className={[
          'relative flex min-h-[120px] flex-1 flex-col gap-3 rounded-xl border border-dashed bg-wn-bg/25 p-2 transition-[border-color,box-shadow,background-color] duration-250 ease-out md:min-h-[200px]',
          isOver
            ? 'border-wn-accent/55 bg-wn-accent/8 shadow-[0_0_36px_-10px_var(--color-wn-accent-glow),inset_0_0_0_1px_rgba(192,132,252,0.2)]'
            : 'border-wn-border/50',
        ].join(' ')}
      >
        {tasks.length === 0 ? (
          <li className="flex flex-1 list-none items-center justify-center py-4">
            <div
              className={[
                'w-full rounded-lg border border-dashed px-4 py-8 text-center transition-[border-color,background-color] duration-250 ease-out',
                isOver
                  ? 'border-wn-accent/40 bg-wn-accent/10'
                  : 'border-wn-border/45 bg-wn-surface/20',
              ].join(' ')}
            >
              <p className="text-xs font-medium text-wn-muted/85">
                Drop tasks here
              </p>
              <p className="mt-1 text-[11px] text-wn-muted/60">
                Or click a card to open details
              </p>
            </div>
          </li>
        ) : null}
        {tasks.map((task, i) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.28,
              delay: listDelay + i * 0.04,
              ease: easeOut,
            }}
            className="list-none"
          >
            <DraggableKanbanCard task={task} onOpenTask={() => onOpenTask(task)} />
          </motion.li>
        ))}
      </ul>

      <motion.button
        type="button"
        className="relative mt-3 w-full rounded-xl border border-dashed border-wn-border/55 bg-wn-bg/20 py-2.5 text-xs font-semibold text-wn-muted/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[color,background-color,border-color,box-shadow] duration-200 ease-out hover:border-wn-accent/35 hover:bg-wn-accent/8 hover:text-wn-text hover:shadow-[0_0_24px_-10px_rgba(192,132,252,0.35)]"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        transition={cardEase}
      >
        + Add Task
      </motion.button>
    </div>
  )
}

function ColumnHeaderIcon({ columnId }: { columnId: KanbanColumnId }) {
  const className = 'h-3.5 w-3.5'
  switch (columnId) {
    case 'todo':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2"
          />
        </svg>
      )
    case 'in_progress':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      )
    case 'done':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      )
    default: {
      const _exhaustive: never = columnId
      return _exhaustive
    }
  }
}

type DraggableCardProps = {
  task: KanbanTask
  onOpenTask: () => void
}

function DraggableKanbanCard({ task, onOpenTask }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { type: 'task', task },
    })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    transition: isDragging ? undefined : 'opacity 0.2s ease',
  }

  const hoverShadow =
    '0 18px 44px -14px rgba(0,0,0,0.58), 0 0 40px -12px rgba(192,132,252,0.32), inset 0 1px 0 rgba(255,255,255,0.09)'

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="rounded-xl"
      whileHover={
        isDragging
          ? undefined
          : {
              scale: 1.025,
              y: -3,
              boxShadow: hoverShadow,
              transition: cardEase,
            }
      }
      whileTap={{ scale: 0.985 }}
      transition={cardEase}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          if (!isDragging) onOpenTask()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!isDragging) onOpenTask()
          }
        }}
        aria-label={`${task.title}. Drag to move or activate to open details.`}
        className={[
          'relative overflow-hidden rounded-xl border border-wn-border/85 bg-wn-surface/55 p-4 ring-1 ring-white/4',
          'shadow-[0_2px_8px_-2px_rgba(0,0,0,0.45),0_12px_28px_-14px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]',
          'cursor-grab transition-[box-shadow,border-color] duration-260 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wn-accent/45',
          isDragging
            ? 'cursor-grabbing border-wn-accent/40 shadow-[0_22px_48px_-12px_rgba(0,0,0,0.62),0_0_44px_-8px_rgba(192,132,252,0.38)]'
            : 'active:cursor-grabbing',
        ].join(' ')}
      >
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-white/4 via-transparent to-wn-accent/5" />

        <div className="relative flex items-start justify-between gap-3">
          <p className="text-sm font-medium leading-snug text-wn-text">
            {task.title}
          </p>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-wn-border/70 bg-wn-elevated/70 text-[10px] font-semibold text-wn-text shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            aria-hidden
          >
            {task.initials}
          </span>
        </div>

        <div className="relative mt-3 flex flex-wrap items-center gap-2">
          <TagPill tag={task.tag} />
          <PriorityBadge priority={task.priority} />
          {task.dueDate ? (
            <span className="text-xs text-wn-muted">Due {task.dueDate}</span>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}

function KanbanDragPreview({ task }: { task: KanbanTask }) {
  return (
    <div className="w-[280px] rotate-2 cursor-grabbing rounded-xl border border-wn-accent/45 bg-wn-surface/95 p-4 shadow-[0_24px_56px_-12px_rgba(0,0,0,0.65),0_0_48px_-8px_rgba(192,132,252,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] ring-2 ring-wn-accent/30 backdrop-blur-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-wn-text">{task.title}</p>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-wn-border/70 bg-wn-elevated/80 text-[10px] font-semibold">
          {task.initials}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <PriorityBadge priority={task.priority} />
        {task.dueDate ? (
          <span className="text-xs text-wn-muted">Due {task.dueDate}</span>
        ) : null}
      </div>
    </div>
  )
}

function TagPill({ tag }: { tag: KanbanTag }) {
  const styles: Record<KanbanTag, string> = {
    Design:
      'border-wn-accent/35 bg-wn-accent/12 text-wn-accent shadow-[0_0_16px_-8px_rgba(192,132,252,0.45)]',
    Dev: 'border-sky-500/25 bg-sky-500/10 text-sky-200/90',
    Ops: 'border-amber-500/30 bg-amber-500/10 text-amber-200/90',
    QA: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200/90',
  }
  return (
    <span
      className={[
        'inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium',
        styles[tag],
      ].join(' ')}
    >
      {tag}
    </span>
  )
}
