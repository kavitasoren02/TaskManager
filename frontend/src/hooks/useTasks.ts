import useSWR from "swr"
import { api } from "../lib/api"
import type { Task } from "../types"
import { useEffect } from "react"
import { getSocket } from "../lib/socket"

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export const useTasks = (filters?: {
  status?: string
  priority?: string
  assignedToId?: string
  creatorId?: string
}) => {
  const params = new URLSearchParams()
  if (filters?.status) params.append("status", filters.status)
  if (filters?.priority) params.append("priority", filters.priority)
  if (filters?.assignedToId) params.append("assignedToId", filters.assignedToId)
  if (filters?.creatorId) params.append("creatorId", filters.creatorId)

  const queryString = params.toString()
  const url = `/tasks${queryString ? `?${queryString}` : ""}`

  const { data, error, isLoading, mutate } = useSWR<Task[]>(url, fetcher)

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleTaskCreated = (task: Task) => {
      mutate((currentTasks) => {
        if (!currentTasks) return [task]
        return [task, ...currentTasks]
      }, false)
    }

    const handleTaskUpdated = (task: Task) => {
      mutate((currentTasks) => {
        if (!currentTasks) return [task]
        return currentTasks.map((t) => (t._id === task._id ? task : t))
      }, false)
    }

    const handleTaskDeleted = (taskId: string) => {
      mutate((currentTasks) => {
        if (!currentTasks) return []
        return currentTasks.filter((t) => t._id !== taskId)
      }, false)
    }

    socket.on("task:created", handleTaskCreated)
    socket.on("task:updated", handleTaskUpdated)
    socket.on("task:deleted", handleTaskDeleted)

    return () => {
      socket.off("task:created", handleTaskCreated)
      socket.off("task:updated", handleTaskUpdated)
      socket.off("task:deleted", handleTaskDeleted)
    }
  }, [mutate])

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export const useTask = (taskId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR<Task>(taskId ? `/tasks/${taskId}` : null, fetcher)

  useEffect(() => {
    const socket = getSocket()
    if (!socket || !taskId) return

    const handleTaskUpdated = (task: Task) => {
      if (task._id === taskId) {
        mutate(task, false)
      }
    }

    const handleTaskDeleted = (deletedTaskId: string) => {
      if (deletedTaskId === taskId) {
        mutate(undefined, false)
      }
    }

    socket.on("task:updated", handleTaskUpdated)
    socket.on("task:deleted", handleTaskDeleted)

    return () => {
      socket.off("task:updated", handleTaskUpdated)
      socket.off("task:deleted", handleTaskDeleted)
    }
  }, [taskId, mutate])

  return {
    task: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export const useOverdueTasks = () => {
  const { data, error, isLoading, mutate } = useSWR<Task[]>("/tasks/overdue", fetcher)

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate,
  }
}
