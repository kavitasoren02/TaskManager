import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Layout } from "../components/Layout"
import { TaskForm } from "../components/TaskForm"
import { useTask } from "../hooks/useTasks"
import { getSocket } from "../lib/socket"
import { ArrowLeft } from "lucide-react"

export const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { task, isLoading } = useTask(id)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse rounded-xl bg-card"></div>
        </div>
      </Layout>
    )
  }

  if (!task) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-lg font-medium text-foreground">Task not found</p>
          </div>
        </div>
      </Layout>
    )
  }

  const handleSubmit = async (data: any) => {
    const socket = getSocket()
    if (!socket) {
      setError("Not connected to server")
      return
    }

    try {
      setIsUpdating(true)
      setError("")

      socket.emit(
        "task:update",
        {
          taskId: id,
          updates: {
            ...data,
            dueDate: new Date(data.dueDate).toISOString(),
            assignedToId: data.assignedToId || null,
          },
        },
        (response: { success: boolean; task?: any; error?: string }) => {
          if (response.success) {
            navigate(`/tasks/${id}`)
          } else {
            setError(response.error || "Failed to update task")
            setIsUpdating(false)
          }
        },
      )
    } catch (err: any) {
      setError("Failed to update task")
      setIsUpdating(false)
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/tasks/${id}`)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to task
        </button>

        <div className="rounded-xl bg-card p-6 shadow-sm sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Edit Task</h1>

          {error && <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <TaskForm
            task={task}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/tasks/${id}`)}
            isLoading={isUpdating}
          />
        </div>
      </div>
    </Layout>
  )
}
