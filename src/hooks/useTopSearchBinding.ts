import { useLocation } from 'react-router-dom'
import { useProjectsBrowse } from '../contexts/ProjectsBrowseContext'

export function useTopSearchBinding() {
  const ctx = useProjectsBrowse()
  const { pathname } = useLocation()
  const isProjects = pathname === '/projects'
  const isTasks = pathname === '/tasks'

  if (!ctx) {
    throw new Error('useTopSearchBinding must be used within ProjectsBrowseProvider')
  }

  const value = isTasks
    ? ctx.tasksSearchQuery
    : ctx.projectsSearchQuery
  const onChange = isTasks
    ? ctx.setTasksSearchQuery
    : ctx.setProjectsSearchQuery

  const placeholder = isProjects
    ? 'Search projects…'
    : isTasks
      ? 'Search tasks…'
      : 'Search projects, tasks…'

  return {
    value,
    onChange,
    placeholder,
    isProjects,
    isTasks,
  }
}
