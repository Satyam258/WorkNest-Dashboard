export type KanbanColumnId = 'todo' | 'in_progress' | 'done'

export type KanbanTag = 'Design' | 'Dev' | 'Ops' | 'QA'

export type KanbanPriority = 'Low' | 'Medium' | 'High'

export type KanbanTask = {
  id: string
  column: KanbanColumnId
  title: string
  description: string
  tag: KanbanTag
  priority: KanbanPriority
  initials: string
  assigneeName: string
  dueDate?: string
}

export const kanbanColumns: {
  id: KanbanColumnId
  title: string
}[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

export const initialKanbanTasks: KanbanTask[] = [
  {
    id: 'k1',
    column: 'todo',
    title: 'Refine onboarding empty states',
    description:
      'Tighten copy, illustrations, and CTA hierarchy for first-time workspace setup.',
    tag: 'Design',
    priority: 'High',
    initials: 'SK',
    assigneeName: 'Sam Kim',
    dueDate: 'Apr 2',
  },
  {
    id: 'k2',
    column: 'todo',
    title: 'Draft API error taxonomy',
    description:
      'Define stable error codes and human-readable messages for client retries.',
    tag: 'Dev',
    priority: 'Medium',
    initials: 'MR',
    assigneeName: 'Maya Rivera',
  },
  {
    id: 'k3',
    column: 'in_progress',
    title: 'Wire up billing webhooks',
    description:
      'Verify signature validation, idempotency keys, and dead-letter handling.',
    tag: 'Dev',
    priority: 'High',
    initials: 'JL',
    assigneeName: 'Jordan Lee',
    dueDate: 'Mar 31',
  },
  {
    id: 'k4',
    column: 'in_progress',
    title: 'Dark mode audit for settings',
    description:
      'Fix contrast regressions and token drift across forms and tables.',
    tag: 'Design',
    priority: 'Medium',
    initials: 'AN',
    assigneeName: 'Alex Ng',
  },
  {
    id: 'k5',
    column: 'in_progress',
    title: 'Rotate staging secrets',
    description:
      'Roll new credentials, update vault references, and notify dependent services.',
    tag: 'Ops',
    priority: 'Low',
    initials: 'TC',
    assigneeName: 'Taylor Chen',
    dueDate: 'Today',
  },
  {
    id: 'k6',
    column: 'done',
    title: 'Ship dashboard shell QA',
    description:
      'Regression pass on navigation, responsive sidebar, and top bar affordances.',
    tag: 'QA',
    priority: 'Medium',
    initials: 'EV',
    assigneeName: 'Elena Voss',
    dueDate: 'Mar 28',
  },
  {
    id: 'k7',
    column: 'done',
    title: 'Update runbook for deploys',
    description:
      'Document rollback steps, feature flags, and comms template for incidents.',
    tag: 'Ops',
    priority: 'Low',
    initials: 'TC',
    assigneeName: 'Taylor Chen',
  },
]
