import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  initialKanbanTasks,
  type KanbanColumnId,
  type KanbanTask,
} from '../components/dashboard/kanbanData'

type TasksContextValue = {
  tasks: KanbanTask[]
  updateTask: (id: string, patch: Partial<KanbanTask>) => void
  setTaskColumn: (id: string, column: KanbanColumnId) => void
}

const TasksContext = createContext<TasksContextValue | null>(null)

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<KanbanTask[]>(() => [
    ...initialKanbanTasks,
  ])

  const updateTask = useCallback((id: string, patch: Partial<KanbanTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    )
  }, [])

  const setTaskColumn = useCallback((id: string, column: KanbanColumnId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, column } : t)),
    )
  }, [])

  const value = useMemo(
    () => ({ tasks, updateTask, setTaskColumn }),
    [tasks, updateTask, setTaskColumn],
  )

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within TasksProvider')
  return ctx
}
