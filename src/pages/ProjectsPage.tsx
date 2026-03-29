import { motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { CreateProjectModal } from '../components/projects/CreateProjectModal'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectDetailModal } from '../components/projects/ProjectDetailModal'
import { GlassMenuSelect } from '../components/projects/GlassMenuSelect'
import {
  seedProjects,
  type Project,
  type ProjectStatus,
} from '../components/projects/projectsData'
import { useProjectsBrowse } from '../contexts/ProjectsBrowseContext'

const ease = [0.22, 1, 0.36, 1] as const

type FilterKey = 'all' | 'active' | 'completed'
type SortKey = 'newest' | 'progress'

const filterOptions: { value: FilterKey; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'progress', label: 'Progress' },
]

function newProjectId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `p-${Date.now()}`
}

export function ProjectsPage() {
  const browse = useProjectsBrowse()
  const search = browse?.projectsSearchQuery ?? ''

  const [projects, setProjects] = useState<Project[]>(() => [...seedProjects])
  const [filter, setFilter] = useState<FilterKey>('all')
  const [sort, setSort] = useState<SortKey>('newest')

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailProjectId, setDetailProjectId] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)

  const detailProject = useMemo(() => {
    if (!detailProjectId) return null
    return projects.find((p) => p.id === detailProjectId) ?? null
  }, [detailProjectId, projects])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = projects.filter((p) => {
      if (filter === 'active' && p.status !== 'active') return false
      if (filter === 'completed' && p.status !== 'completed') return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    })

    list = [...list].sort((a, b) => {
      if (sort === 'newest') return b.updatedAt - a.updatedAt
      return b.progress - a.progress
    })

    return list
  }, [projects, search, filter, sort])

  const openDetail = useCallback((p: Project) => {
    setCreateOpen(false)
    setDetailProjectId(p.id)
    setDetailOpen(true)
  }, [])

  const closeDetail = useCallback(() => setDetailOpen(false), [])
  const clearDetail = useCallback(() => setDetailProjectId(null), [])

  const openCreate = useCallback(() => {
    setDetailOpen(false)
    setCreateOpen(true)
  }, [])

  const closeCreate = useCallback(() => setCreateOpen(false), [])

  const handleCreate = useCallback(
    (payload: { name: string; description: string; status: ProjectStatus }) => {
      const desc =
        payload.description.trim() || 'No description yet — add details anytime.'
      const next: Project = {
        id: newProjectId(),
        name: payload.name,
        description: desc,
        progress: payload.status === 'completed' ? 100 : 0,
        taskCount: 0,
        members: [{ initials: 'ME' }],
        status: payload.status,
        updatedAt: Date.now(),
      }
      setProjects((prev) => [next, ...prev])
    },
    [],
  )

  const hasProjects = projects.length > 0
  const noMatches = hasProjects && filtered.length === 0

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-wn-accent uppercase">
            Workspace
          </p>
          <p className="max-w-2xl text-sm leading-relaxed text-wn-muted">
            Manage projects locally — search syncs with the top bar. Create and
            filters are UI-only (no API).
          </p>
        </div>
        <motion.button
          type="button"
          onClick={openCreate}
          className="shrink-0 rounded-xl border border-wn-accent/35 bg-linear-to-r from-wn-accent/20 to-sky-500/15 px-4 py-2.5 text-sm font-semibold text-wn-text shadow-[0_0_24px_-10px_rgba(192,132,252,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[box-shadow,transform,border-color] duration-200 hover:border-wn-accent/50 hover:shadow-[0_0_32px_-8px_rgba(192,132,252,0.55)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.22, ease }}
        >
          Create Project
        </motion.button>
      </header>

      {hasProjects ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <GlassMenuSelect<FilterKey>
              label="Filter"
              value={filter}
              onChange={setFilter}
              options={filterOptions}
            />
            <GlassMenuSelect<SortKey>
              label="Sort"
              value={sort}
              onChange={setSort}
              options={sortOptions}
              minWidthClass="sm:min-w-[160px]"
            />
          </div>
          <p className="text-xs text-wn-muted transition-opacity duration-200">
            <span className="font-semibold tabular-nums text-wn-text">
              {filtered.length}
            </span>{' '}
            {filtered.length === 1 ? 'project' : 'projects'}
            {search.trim() ? (
              <span className="text-wn-muted/80"> matching search</span>
            ) : null}
          </p>
        </div>
      ) : null}

      {!hasProjects ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease }}
          className="rounded-2xl border border-wn-border/70 bg-wn-surface/45 px-6 py-14 text-center shadow-[0_2px_12px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/4 md:px-10 md:py-16"
        >
          <div className="mx-auto flex max-w-sm flex-col items-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-wn-border/60 bg-wn-bg/40 text-wn-accent shadow-[0_0_32px_-10px_rgba(192,132,252,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-200"
              aria-hidden
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5V6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4.5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11.5v4M10 13.5h4"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-lg font-bold tracking-tight text-wn-text">
              No projects yet
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-wn-muted">
              Start by creating your first workspace project. Everything stays
              in this browser until you connect a backend.
            </p>
            <motion.button
              type="button"
              onClick={openCreate}
              className="mt-8 rounded-xl border border-wn-accent/40 bg-linear-to-r from-wn-accent/25 to-sky-500/15 px-5 py-2.5 text-sm font-semibold text-wn-text shadow-[0_0_28px_-10px_rgba(192,132,252,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] transition-[box-shadow,border-color] duration-200 hover:border-wn-accent/55 hover:shadow-[0_0_36px_-8px_rgba(192,132,252,0.55)]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.22, ease }}
            >
              Create your first project
            </motion.button>
          </div>
        </motion.div>
      ) : noMatches ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease }}
          className="rounded-2xl border border-dashed border-wn-border/55 bg-wn-surface/35 px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <p className="text-sm font-medium text-wn-text">No projects match</p>
          <p className="mt-1 text-xs text-wn-muted">
            Adjust search, filter, or sort — or clear the top bar search.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={() => openDetail(project)}
            />
          ))}
        </div>
      )}

      <ProjectDetailModal
        open={detailOpen}
        project={detailProject}
        onClose={closeDetail}
        onExited={clearDetail}
      />

      <CreateProjectModal
        open={createOpen}
        onClose={closeCreate}
        onCreate={handleCreate}
      />
    </div>
  )
}
