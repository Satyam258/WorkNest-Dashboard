import { motion } from 'framer-motion'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { taskProgressOverTime } from './mockData'

const accent = '#c084fc'
const mutedLine = 'rgba(156,163,175,0.75)'

export function TaskProgressChart() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-wn-border/85 bg-wn-surface/55 p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.45),0_16px_40px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/4 md:p-6"
      aria-labelledby="task-progress-heading"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-wn-accent/8 via-transparent to-transparent opacity-90" />

      <div className="relative mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="task-progress-heading"
            className="text-base font-semibold tracking-tight text-wn-text"
          >
            Task progress over time
          </h2>
          <p className="mt-1 text-sm text-wn-muted">
            Mock weekly trend — completed vs. in progress
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-wn-muted">
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shadow-[0_0_10px_rgba(192,132,252,0.5)]"
              style={{ backgroundColor: accent }}
            />
            Completed
          </span>
          <span className="inline-flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: mutedLine }}
            />
            In progress
          </span>
        </div>
      </div>

      <div className="relative w-full min-w-0" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart
            data={taskProgressOverTime}
            margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="4 8"
              stroke="rgba(46,48,58,0.95)"
              vertical={false}
            />
            <XAxis
              dataKey="period"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#2e303a' }}
              dy={6}
            />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              cursor={{
                stroke: 'rgba(192,132,252,0.35)',
                strokeWidth: 1,
              }}
              contentStyle={{
                backgroundColor: '#1f2028',
                border: '1px solid rgba(46,48,58,0.95)',
                borderRadius: '12px',
                boxShadow:
                  '0 12px 32px -12px rgba(0,0,0,0.55), 0 0 24px -8px rgba(192,132,252,0.2)',
              }}
              labelStyle={{
                color: '#f3f4f6',
                fontWeight: 600,
                marginBottom: 4,
              }}
              formatter={(value, name) => {
                const n =
                  typeof value === 'number'
                    ? value
                    : typeof value === 'string'
                      ? Number(value)
                      : NaN
                const label =
                  name === 'completed' ? 'Completed' : 'In progress'
                return [Number.isFinite(n) ? n : '—', label]
              }}
            />
            <Line
              type="monotone"
              dataKey="active"
              name="active"
              stroke={mutedLine}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: mutedLine }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              name="completed"
              stroke={accent}
              strokeWidth={2.25}
              dot={{ r: 3, fill: accent, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: accent, stroke: '#1f2028', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  )
}
