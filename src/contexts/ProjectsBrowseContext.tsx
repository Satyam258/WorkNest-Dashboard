import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ProjectsBrowseContextValue = {
  projectsSearchQuery: string
  setProjectsSearchQuery: (q: string) => void
  tasksSearchQuery: string
  setTasksSearchQuery: (q: string) => void
}

const ProjectsBrowseContext =
  createContext<ProjectsBrowseContextValue | null>(null)

export function ProjectsBrowseProvider({ children }: { children: ReactNode }) {
  const [projectsSearchQuery, setProjectsSearchQuery] = useState('')
  const [tasksSearchQuery, setTasksSearchQuery] = useState('')
  const value = useMemo(
    () => ({
      projectsSearchQuery,
      setProjectsSearchQuery,
      tasksSearchQuery,
      setTasksSearchQuery,
    }),
    [projectsSearchQuery, tasksSearchQuery],
  )
  return (
    <ProjectsBrowseContext.Provider value={value}>
      {children}
    </ProjectsBrowseContext.Provider>
  )
}

export function useProjectsBrowse() {
  return useContext(ProjectsBrowseContext)
}
