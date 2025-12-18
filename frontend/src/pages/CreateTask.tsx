import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Layout } from "../components/Layout"
import { TaskForm } from "../components/TaskForm"
import { getSocket } from "../lib/socket"
import { ArrowLeft } from "lucide-react"

export const CreateTask: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (data: any) => {
    const socket = getSocket()
    if (!socket) {
      setError("Not connected to server")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      socket.emit(
        "task:create",
        {
          ...data,
          dueDate: new Date(data.dueDate).toISOString(),
          assignedToId: data.assignedToId || null,
        },
        (response: { success: boolean; task?: any; error?: string }) => {
          if (response.success) {
            navigate("/tasks")
          } else {
            setError(response.error || "Failed to create task")
            setIsLoading(false)
          }
        },
      )
    } catch (err: any) {
      setError("Failed to create task")
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/tasks")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to tasks
        </button>

        <div className="rounded-xl bg-card p-6 shadow-sm sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Create New Task</h1>

          {error && <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <TaskForm onSubmit={handleSubmit} onCancel={() => navigate("/tasks")} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  )
}
