export type ProjectMember = {
  initials: string
}

export type ProjectStatus = 'active' | 'completed'

export type Project = {
  id: string
  name: string
  description: string
  progress: number
  taskCount: number
  members: ProjectMember[]
  status: ProjectStatus
  /** For "Newest" sort — higher = more recent */
  updatedAt: number
}

/** Initial seed data — copy into component state for interactive CRUD-style UX */
export const seedProjects: Project[] = [
  {
    id: 'p1',
    name: 'Northwind Billing',
    description:
      'Subscriptions, invoices, and webhook reliability for enterprise tenants.',
    progress: 72,
    taskCount: 38,
    members: [{ initials: 'JL' }, { initials: 'MR' }, { initials: 'SK' }, { initials: 'AN' }],
    status: 'active',
    updatedAt: 1_712_000_000_000,
  },
  {
    id: 'p2',
    name: 'Design System 2.0',
    description:
      'Tokens, components, and documentation for a cohesive dark-first UI.',
    progress: 45,
    taskCount: 24,
    members: [{ initials: 'SK' }, { initials: 'EV' }],
    status: 'active',
    updatedAt: 1_711_900_000_000,
  },
  {
    id: 'p3',
    name: 'Commerce Checkout',
    description:
      'Reduce drop-off with clearer errors, saved carts, and Apple Pay.',
    progress: 100,
    taskCount: 52,
    members: [{ initials: 'TC' }, { initials: 'JL' }, { initials: 'MR' }],
    status: 'completed',
    updatedAt: 1_712_050_000_000,
  },
  {
    id: 'p4',
    name: 'Internal Ops Hub',
    description:
      'Runbooks, on-call schedules, and incident timelines in one place.',
    progress: 34,
    taskCount: 19,
    members: [{ initials: 'TC' }, { initials: 'AN' }],
    status: 'active',
    updatedAt: 1_711_800_000_000,
  },
  {
    id: 'p5',
    name: 'Mobile shell',
    description:
      'Shared navigation, offline cache, and push notification plumbing.',
    progress: 61,
    taskCount: 31,
    members: [{ initials: 'MR' }, { initials: 'EV' }, { initials: 'SK' }],
    status: 'active',
    updatedAt: 1_712_030_000_000,
  },
  {
    id: 'p6',
    name: 'Analytics refresh',
    description:
      'Event schema cleanup and dashboard performance for product teams.',
    progress: 100,
    taskCount: 14,
    members: [{ initials: 'JL' }],
    status: 'completed',
    updatedAt: 1_711_700_000_000,
  },
]
