export const stats = [
  {
    key: 'total',
    title: 'Total Tasks',
    value: 128,
    icon: 'list' as const,
  },
  {
    key: 'completed',
    title: 'Completed Tasks',
    value: 94,
    icon: 'check' as const,
  },
  {
    key: 'progress',
    title: 'In Progress',
    value: 24,
    icon: 'pulse' as const,
  },
  {
    key: 'team',
    title: 'Team Members',
    value: 8,
    icon: 'users' as const,
  },
]

export type TaskProgressPoint = {
  period: string
  completed: number
  active: number
}

export const taskProgressOverTime: TaskProgressPoint[] = [
  { period: 'Mon', completed: 12, active: 18 },
  { period: 'Tue', completed: 18, active: 16 },
  { period: 'Wed', completed: 22, active: 14 },
  { period: 'Thu', completed: 28, active: 20 },
  { period: 'Fri', completed: 35, active: 17 },
  { period: 'Sat', completed: 38, active: 12 },
  { period: 'Sun', completed: 42, active: 10 },
]

export type ActivityItem = {
  id: string
  title: string
  meta: string
  tone: 'default' | 'success' | 'warning'
}

export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    title: 'API contract finalized for billing module',
    meta: 'Project · Northwind · 12 min ago',
    tone: 'default',
  },
  {
    id: '2',
    title: 'Sprint demo deck marked complete',
    meta: 'Tasks · Design · 1 hr ago',
    tone: 'success',
  },
  {
    id: '3',
    title: 'QA flagged regression on checkout flow',
    meta: 'Alerts · Commerce · 3 hr ago',
    tone: 'warning',
  },
  {
    id: '4',
    title: 'New hire invited to Workspace',
    meta: 'Team · People · Yesterday',
    tone: 'default',
  },
  {
    id: '5',
    title: 'Weekly sync notes published',
    meta: 'Docs · Internal · Yesterday',
    tone: 'default',
  },
]
