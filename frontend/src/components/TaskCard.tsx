import type React from "react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { Calendar, User, AlertCircle } from "lucide-react"
import type { Task } from "../types"

interface TaskCardProps {
  task: Task
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "Completed"

  const priorityColors = {
    Urgent: "bg-red-500/10 text-red-500 border-red-500/20",
    High: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Low: "bg-green-500/10 text-green-500 border-green-500/20",
  }

  const statusColors = {
    "To Do": "bg-gray-500/10 text-gray-500",
    "In Progress": "bg-blue-500/10 text-blue-500",
    Review: "bg-purple-500/10 text-purple-500",
    Completed: "bg-green-500/10 text-green-500",
  }

  return (
    <Link
      to={`/tasks/${task._id}`}
      className="block rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
        {isOverdue && <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />}
      </div>

      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[task.status]}`}>{task.status}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span className={isOverdue ? "text-destructive font-medium" : ""}>
            {format(new Date(task.dueDate), "MMM d, yyyy")}
          </span>
        </div>
        {task.assignedToId && (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{task.assignedToId.name}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
