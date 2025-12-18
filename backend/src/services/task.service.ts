import { Task } from "../models/Task.model"
import type { CreateTaskDtoType, UpdateTaskDtoType } from "../dto/task.dto"
import { NotificationService } from "./notification.service"
import { io } from "../server"
import { emitNotification } from "../socket/socket"

export class TaskService {
  private notificationService = new NotificationService()

  async createTask(userId: string, data: CreateTaskDtoType) {
    const task = await Task.create({
      ...data,
      creatorId: userId,
      dueDate: new Date(data.dueDate),
      assignedToId: data.assignedToId || null,
    })

    const populatedTask = await Task.findById(task._id)
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")

    if (data.assignedToId && data.assignedToId !== userId) {
      const notification = await this.notificationService.createNotification({
        userId: data.assignedToId,
        message: `You have been assigned a new task: ${data.title}`,
        type: "task_assigned",
        taskId: task._id.toString(),
      })

      emitNotification(io, data.assignedToId, notification)
    }

    return populatedTask
  }

  async getTasks(filters: {
    status?: string
    priority?: string
    assignedToId?: string
    creatorId?: string
  }) {
    const query: any = {}

    if (filters.status) {
      query.status = filters.status
    }
    if (filters.priority) {
      query.priority = filters.priority
    }
    if (filters.assignedToId) {
      query.assignedToId = filters.assignedToId
    }
    if (filters.creatorId) {
      query.creatorId = filters.creatorId
    }

    const tasks = await Task.find(query)
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")
      .sort({ createdAt: -1 })

    return tasks
  }

  async getTaskById(taskId: string) {
    const task = await Task.findById(taskId).populate("creatorId", "name email").populate("assignedToId", "name email")

    if (!task) {
      throw new Error("Task not found")
    }

    return task
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskDtoType) {
    const task = await Task.findById(taskId)

    if (!task) {
      throw new Error("Task not found")
    }

    const previousAssignedToId = task.assignedToId?.toString()

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : task.dueDate,
      },
      { new: true },
    )
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")

    if (data.assignedToId && data.assignedToId !== previousAssignedToId && data.assignedToId !== userId) {
      const notification = await this.notificationService.createNotification({
        userId: data.assignedToId,
        message: `You have been assigned to task: ${updatedTask?.title}`,
        type: "task_assigned",
        taskId: taskId,
      })

      emitNotification(io, data.assignedToId, notification)
    }

    return updatedTask
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await Task.findById(taskId)

    if (!task) {
      throw new Error("Task not found")
    }

    if (task.creatorId.toString() !== userId) {
      throw new Error("You are not authorized to delete this task")
    }

    await Task.findByIdAndDelete(taskId)

    return { message: "Task deleted successfully" }
  }

  async getOverdueTasks(userId?: string) {
    const query: any = {
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" },
    }

    if (userId) {
      query.$or = [{ creatorId: userId }, { assignedToId: userId }]
    }

    const tasks = await Task.find(query)
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")
      .sort({ dueDate: 1 })

    return tasks
  }
}
