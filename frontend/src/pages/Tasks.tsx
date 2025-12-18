import type React from "react"
import { useState, useCallback } from "react"
import { Layout } from "../components/Layout"
import { TaskCard } from "../components/TaskCard"
import { useTasks } from "../hooks/useTasks"
import { useRealtimeTasks } from "../hooks/useRealtime"
import { Plus, Filter } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"

export const Tasks: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "")
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get("priority") || "")

  const { tasks, isLoading, mutate } = useTasks({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  })

  const handleTaskUpdate = useCallback(() => {
    mutate()
  }, [mutate])

  useRealtimeTasks(handleTaskUpdate)

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    if (status) {
      searchParams.set("status", status)
    } else {
      searchParams.delete("status")
    }
    setSearchParams(searchParams)
  }

  const handlePriorityFilter = (priority: string) => {
    setPriorityFilter(priority)
    if (priority) {
      searchParams.set("priority", priority)
    } else {
      searchParams.delete("priority")
    }
    setSearchParams(searchParams)
  }

  const handleClearFilters = () => {
    setStatusFilter("")
    setPriorityFilter("")
    setSearchParams({})
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Tasks</h1>
            <p className="mt-2 text-muted-foreground">Manage and track all your tasks</p>
          </div>
          <button
            onClick={() => navigate("/tasks/new")}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            New Task
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          >
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => handlePriorityFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          {(statusFilter || priorityFilter) && (
            <button onClick={handleClearFilters} className="text-sm font-medium text-primary hover:underline">
              Clear filters
            </button>
          )}

          {tasks && (
            <span className="ml-auto text-sm text-muted-foreground">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-card"></div>
            ))}
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-12">
            <p className="text-lg font-medium text-foreground">No tasks found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {statusFilter || priorityFilter ? "Try adjusting your filters" : "Create your first task to get started"}
            </p>
            <button
              onClick={() => navigate("/tasks/new")}
              className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-5 w-5" />
              Create Task
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
