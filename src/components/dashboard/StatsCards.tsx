import { motion } from 'framer-motion'
import { stats } from './mockData'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 26, stiffness: 320 },
  },
}

export function StatsCards() {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5"
    >
      {stats.map((s) => (
        <motion.li key={s.key} variants={item} className="list-none">
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-wn-border/85 bg-wn-surface/40 p-5 ring-1 ring-white/4"
            initial={{
              boxShadow:
                '0 2px 8px -2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
            whileHover={{
              y: -4,
              boxShadow:
                '0 14px 40px -14px rgba(0,0,0,0.55), 0 0 40px -14px rgba(192,132,252,0.32), inset 0 1px 0 rgba(255,255,255,0.07)',
            }}
            transition={{ type: 'spring', damping: 22, stiffness: 380 }}
            whileTap={{ scale: 0.985 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-wn-accent/12 via-transparent to-wn-surface/30" />
            <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-wn-accent/10 blur-2xl" />

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-wn-muted uppercase">
                  {s.title}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-wn-text tabular-nums">
                  {s.value}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-wn-border/70 bg-wn-elevated/60 text-wn-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_20px_-8px_rgba(192,132,252,0.35)]">
                <StatIcon name={s.icon} />
              </span>
            </div>
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  )
}

function StatIcon({ name }: { name: (typeof stats)[number]['icon'] }) {
  const className = 'h-5 w-5'
  switch (name) {
    case 'list':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01"
          />
        </svg>
      )
    case 'check':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 11l3 3L22 4"
          />
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
          />
        </svg>
      )
    case 'pulse':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 12h-4l-3 9L9 3l-3 9H2"
          />
        </svg>
      )
    case 'users':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          />
        </svg>
      )
    default:
      return null
  }
}
