import { useEffect } from "react"
import { getSocket } from "../lib/socket"
import type { Task, Notification } from "../types"

export const useRealtimeTasks = (onTaskUpdate: (task: Task) => void) => {
  useEffect(() => {
    const socket = getSocket()

    if (!socket) return

    socket.on("task:created", onTaskUpdate)
    socket.on("task:updated", onTaskUpdate)
    socket.on("task:deleted", onTaskUpdate)

    return () => {
      socket.off("task:created", onTaskUpdate)
      socket.off("task:updated", onTaskUpdate)
      socket.off("task:deleted", onTaskUpdate)
    }
  }, [onTaskUpdate])
}

export const useRealtimeNotifications = (onNotification: (notification: Notification) => void) => {
  useEffect(() => {
    const socket = getSocket()

    if (!socket) return

    socket.on("notification:new", onNotification)

    return () => {
      socket.off("notification:new", onNotification)
    }
  }, [onNotification])
}
