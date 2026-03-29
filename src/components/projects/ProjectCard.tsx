import { motion } from 'framer-motion'
import type { Project } from './projectsData'

const hoverEase = { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const }

type ProjectCardProps = {
  project: Project
  index: number
  onOpen: () => void
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const progress = Math.min(100, Math.max(0, project.progress))

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        delay: index * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.045,
        boxShadow:
          '0 22px 56px -14px rgba(0,0,0,0.6), 0 0 48px -10px rgba(192,132,252,0.38), 0 0 40px -14px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(192,132,252,0.28)',
        transition: { type: 'spring', damping: 22, stiffness: 360 },
      }}
      whileTap={{ scale: 0.99, transition: { duration: 0.15 } }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-wn-border/85 bg-wn-surface/55 p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.45),0_14px_36px_-14px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/4 transition-[border-color,box-shadow] duration-260 ease-out hover:border-wn-accent/25 md:p-6"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      tabIndex={0}
      aria-label={`Open project ${project.name}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-wn-accent/10 via-transparent to-sky-500/8 opacity-90 transition-opacity duration-260 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-wn-accent/10 blur-3xl transition-opacity duration-260 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-36 w-36 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight text-wn-text">
          {project.name}
        </h2>
        <span
          className={[
            'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors duration-200',
            project.status === 'completed'
              ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200/90'
              : 'border-sky-500/30 bg-sky-500/10 text-sky-200/90',
          ].join(' ')}
        >
          {project.status === 'completed' ? 'Done' : 'Active'}
        </span>
      </div>
      <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-wn-muted">
        {project.description}
      </p>

      <div className="relative mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-wn-muted">
          <span>Progress</span>
          <span className="font-semibold tabular-nums text-wn-text">
            {progress}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-wn-border/60 bg-wn-bg/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-wn-accent/90 via-wn-accent/70 to-sky-400/80 shadow-[0_0_16px_-4px_rgba(192,132,252,0.55)]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={hoverEase}
          />
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-medium text-wn-muted">
          <span className="font-semibold tabular-nums text-wn-text">
            {project.taskCount}
          </span>{' '}
          tasks
        </span>
        <div className="flex -space-x-2" aria-label="Team members">
          {project.members.map((m, i) => (
            <span
              key={`${project.id}-${m.initials}-${i}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-wn-surface/90 bg-wn-elevated/90 text-[10px] font-semibold text-wn-text shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_12px_-4px_rgba(192,132,252,0.25)] transition-[box-shadow,transform] duration-200 group-hover:shadow-[0_0_16px_-4px_rgba(192,132,252,0.45)]"
              title={m.initials}
            >
              {m.initials}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}
