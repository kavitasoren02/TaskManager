import type React from "react"
import { useCallback } from "react"
import { Layout } from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useTasks, useOverdueTasks } from "../hooks/useTasks"
import { useRealtimeTasks } from "../hooks/useRealtime"
import { Link } from "react-router-dom"
import { Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const {
    tasks: assignedTasks,
    isLoading: loadingAssigned,
    mutate: mutateAssigned,
  } = useTasks({ assignedToId: user?.id })
  const { tasks: createdTasks, mutate: mutateCreated } = useTasks({ creatorId: user?.id })
  const { tasks: overdueTasks, isLoading: loadingOverdue, mutate: mutateOverdue } = useOverdueTasks()

  const handleTaskUpdate = useCallback(() => {
    console.log(" Real-time task update received on dashboard")
    mutateAssigned()
    mutateCreated()
    mutateOverdue()
  }, [mutateAssigned, mutateCreated, mutateOverdue])

  useRealtimeTasks(handleTaskUpdate)

  const stats = [
    {
      title: "Assigned to Me",
      count: assignedTasks?.length || 0,
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Created by Me",
      count: createdTasks?.length || 0,
      icon: Calendar,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Overdue Tasks",
      count: overdueTasks?.length || 0,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Completed",
      count: assignedTasks?.filter((t) => t.status === "Completed").length || 0,
      icon: CheckCircle2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
          <p className="mt-2 text-muted-foreground">Here's what's happening with your tasks today</p>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="rounded-xl bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{stat.count}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">My Assigned Tasks</h2>
              <Link to="/tasks?filter=assigned" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            {loadingAssigned ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-muted"></div>
                ))}
              </div>
            ) : assignedTasks && assignedTasks.length > 0 ? (
              <div className="space-y-3">
                {assignedTasks.slice(0, 5).map((task) => (
                  <Link
                    key={task._id}
                    to={`/tasks/${task._id}`}
                    className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{task.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          task.priority === "Urgent"
                            ? "bg-red-500/10 text-red-500"
                            : task.priority === "High"
                              ? "bg-orange-500/10 text-orange-500"
                              : task.priority === "Medium"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No tasks assigned to you yet</p>
            )}
          </div>

          <div className="rounded-xl bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Overdue Tasks</h2>
              <Link to="/tasks?filter=overdue" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            {loadingOverdue ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-lg bg-muted"></div>
                ))}
              </div>
            ) : overdueTasks && overdueTasks.length > 0 ? (
              <div className="space-y-3">
                {overdueTasks.slice(0, 5).map((task) => (
                  <Link
                    key={task._id}
                    to={`/tasks/${task._id}`}
                    className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{task.title}</h3>
                        <p className="mt-1 text-sm text-destructive">
                          Overdue since {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </p>
                      </div>
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No overdue tasks</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
