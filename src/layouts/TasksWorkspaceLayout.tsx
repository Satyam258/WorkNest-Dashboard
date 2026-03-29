import { Outlet } from 'react-router-dom'
import { TasksProvider } from '../contexts/TasksContext'

export function TasksWorkspaceLayout() {
  return (
    <TasksProvider>
      <Outlet />
    </TasksProvider>
  )
}
