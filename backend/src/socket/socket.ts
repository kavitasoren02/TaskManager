import type { Server as HTTPServer } from "http"
import { Server, type Socket } from "socket.io"
import jwt from "jsonwebtoken"
import { TaskService } from "../services/task.service"
import { CreateTaskDto, UpdateTaskDto } from "../dto/task.dto"

interface AuthenticatedSocket extends Socket {
  userId?: string
}

export const initSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  })

  const taskService = new TaskService()

  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.headers.cookie?.split("=")[1];
      
      if (!token) {
        return next(new Error("Authentication required"))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {
        userId: string
      }

      socket.userId = decoded.userId
      next()
    } catch (error) {
      console.log({error})
      next(new Error("Invalid token"))
    }
  })

  io.on("connection", (socket: AuthenticatedSocket) => {

    socket.join(`user:${socket.userId}`)

    socket.on("task:create", async (data, callback) => {
      try {
        const validatedData = CreateTaskDto.parse(data)

        const task = await taskService.createTask(socket.userId!, validatedData)

        io.emit("task:created", task)

        callback({ success: true, task })
      } catch (error: any) {
        console.error("Error creating task:", error)
        callback({ success: false, error: error.message || "Failed to create task" })
      }
    })

    socket.on("task:update", async (data: { taskId: string; updates: any }, callback) => {
      try {
        const validatedData = UpdateTaskDto.parse(data.updates)

        const task = await taskService.updateTask(data.taskId, socket.userId!, validatedData)

        io.emit("task:updated", task)

        callback({ success: true, task })
      } catch (error: any) {
        console.error("Error updating task:", error)
        callback({ success: false, error: error.message || "Failed to update task" })
      }
    })

    socket.on("task:delete", async (taskId: string, callback) => {
      try {
        await taskService.deleteTask(taskId, socket.userId!)

        io.emit("task:deleted", taskId)

        callback({ success: true })
      } catch (error: any) {
        console.error("Error deleting task:", error)
        callback({ success: false, error: error.message || "Failed to delete task" })
      }
    })

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`)
    })
  })

  return io
}


export const emitTaskUpdate = (io: Server, task: any) => {
  io.emit("task:updated", task)
}

export const emitNotification = (io: Server, userId: string, notification: any) => {
  io.to(`user:${userId}`).emit("notification:new", notification)
}
