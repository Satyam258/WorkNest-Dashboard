import { KanbanBoard } from '../components/dashboard/KanbanBoard'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import { StatsCards } from '../components/dashboard/StatsCards'
import { TaskProgressChart } from '../components/dashboard/TaskProgressChart'

export function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <StatsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-5 xl:gap-6">
        <div className="min-w-0 lg:col-span-2">
          <TaskProgressChart />
        </div>
        <div className="min-w-0 lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      <KanbanBoard />
    </div>
  )
}
