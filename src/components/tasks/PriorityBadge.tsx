import type { KanbanPriority } from '../dashboard/kanbanData'

const map: Record<
  KanbanPriority,
  { label: string; className: string }
> = {
  High: {
    label: 'High',
    className:
      'border-red-500/50 bg-red-500/18 text-red-50 shadow-[0_0_22px_-4px_rgba(239,68,68,0.65),0_0_36px_-10px_rgba(220,38,38,0.4)] ring-1 ring-red-400/35',
  },
  Medium: {
    label: 'Medium',
    className:
      'border-yellow-500/45 bg-yellow-400/20 text-yellow-950 shadow-[0_0_20px_-4px_rgba(234,179,8,0.5)] ring-1 ring-yellow-400/30 dark:text-yellow-50',
  },
  Low: {
    label: 'Low',
    className:
      'border-wn-border/80 bg-wn-elevated/80 text-wn-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-wn-border/50',
  },
}

type PriorityBadgeProps = {
  priority: KanbanPriority
  size?: 'sm' | 'md'
}

export function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const s = map[priority]
  const sizeCls =
    size === 'md'
      ? 'rounded-lg px-2.5 py-1 text-xs font-semibold tracking-wide uppercase'
      : 'rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase'
  return (
    <span className={`inline-flex ${sizeCls} ${s.className}`}>{s.label}</span>
  )
}
