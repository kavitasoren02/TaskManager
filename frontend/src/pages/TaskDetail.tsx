import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Layout } from "../components/Layout"
import { useTask } from "../hooks/useTasks"
import { getSocket } from "../lib/socket"
import { format } from "date-fns"
import { ArrowLeft, Edit, Trash2, Calendar, User, AlertCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { task, isLoading } = useTask(id)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded bg-muted"></div>
            <div className="h-64 rounded-xl bg-card"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!task) {
    return (
      <Layout>
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-lg font-medium text-foreground">Task not found</p>
            <button
              onClick={() => navigate("/tasks")}
              className="mt-4 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Back to tasks
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "Completed"
  const canDelete = task.creatorId.id === user?.id

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    const socket = getSocket()
    if (!socket) {
      alert("Not connected to server")
      return
    }

    try {
      setIsDeleting(true)
      socket.emit("task:delete", id, (response: { success: boolean; error?: string }) => {
        if (response.success) {
          navigate("/tasks")
        } else {
          alert(response.error || "Failed to delete task")
          setIsDeleting(false)
        }
      })
    } catch (error) {
      alert("Failed to delete task")
      setIsDeleting(false)
    }
  }

  const handleStatusUpdate = async (status: string) => {
    const socket = getSocket()
    if (!socket) {
      alert("Not connected to server")
      return
    }

    try {
      setIsUpdating(true)
      socket.emit(
        "task:update",
        {
          taskId: id,
          updates: { status },
        },
        (response: { success: boolean; error?: string }) => {
          if (!response.success) {
            alert(response.error || "Failed to update status")
          }
          setIsUpdating(false)
        },
      )
    } catch (error) {
      alert("Failed to update status")
      setIsUpdating(false)
    }
  }

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
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/tasks")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tasks
        </button>

        <div className="rounded-xl bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{task.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`rounded-full border px-3 py-1 text-sm font-medium ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[task.status]}`}>
                  {task.status}
                </span>
                {isOverdue && (
                  <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Overdue
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/tasks/${id}/edit`)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Edit className="h-5 w-5" />
              </button>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="mb-6 space-y-6">
            <div>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">Description</h2>
              <p className="whitespace-pre-wrap text-foreground">{task.description}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">Due Date</h2>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className={isOverdue ? "font-medium text-destructive" : ""}>
                    {format(new Date(task.dueDate), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">Assigned To</h2>
                <div className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4" />
                  <span>{task.assignedToId ? task.assignedToId.name : "Unassigned"}</span>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">Created By</h2>
                <div className="flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4" />
                  <span>{task.creatorId.name}</span>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">Created</h2>
                <span className="text-foreground">{format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="mb-3 text-sm font-medium text-foreground">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {["To Do", "In Progress", "Review", "Completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={isUpdating || task.status === status}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                    task.status === status
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
