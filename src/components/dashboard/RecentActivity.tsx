import { motion } from 'framer-motion'
import { recentActivity } from './mockData'

const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.18 },
  },
}

const row = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, damping: 28, stiffness: 360 },
  },
}

export function RecentActivity() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-wn-border/85 bg-wn-surface/55 p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.45),0_16px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/4 md:p-6"
      aria-labelledby="recent-activity-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-tl from-wn-surface/20 via-transparent to-wn-accent/6" />

      <div className="relative mb-4">
        <h2
          id="recent-activity-heading"
          className="text-base font-semibold tracking-tight text-wn-text"
        >
          Recent activity
        </h2>
        <p className="mt-1 text-sm text-wn-muted">
          Latest task and workspace updates
        </p>
      </div>

      <motion.ul
        variants={list}
        initial="hidden"
        animate="show"
        className="relative flex flex-1 flex-col gap-0"
      >
        {recentActivity.map((entry, index) => (
          <motion.li
            key={entry.id}
            variants={row}
            className={[
              'list-none border-wn-border/60 py-3 first:pt-0 last:pb-0',
              index < recentActivity.length - 1 ? 'border-b' : '',
            ].join(' ')}
          >
            <motion.div
              className="group rounded-xl px-1 py-0.5 transition-colors hover:bg-wn-elevated/35"
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', damping: 28, stiffness: 420 }}
            >
              <div className="flex gap-3">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      entry.tone === 'success'
                        ? 'rgba(52,211,153,0.9)'
                        : entry.tone === 'warning'
                          ? 'rgba(251,191,36,0.95)'
                          : 'rgba(192,132,252,0.85)',
                    boxShadow:
                      entry.tone === 'success'
                        ? '0 0 12px rgba(52,211,153,0.35)'
                        : entry.tone === 'warning'
                          ? '0 0 12px rgba(251,191,36,0.35)'
                          : '0 0 12px rgba(192,132,252,0.35)',
                  }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-wn-text transition-colors group-hover:text-white">
                    {entry.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-wn-muted">
                    {entry.meta}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  )
}
