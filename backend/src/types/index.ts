import type { Request } from "express"
import type { Types } from "mongoose"

export interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface ITask {
  _id: Types.ObjectId
  title: string
  description: string
  dueDate: Date
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "To Do" | "In Progress" | "Review" | "Completed"
  creatorId: Types.ObjectId
  assignedToId: Types.ObjectId | null
  createdAt: Date
  updatedAt: Date
}

export interface INotification {
  _id: Types.ObjectId
  userId: Types.ObjectId
  message: string
  type: "task_assigned" | "task_updated" | "task_completed"
  taskId: Types.ObjectId
  read: boolean
  createdAt: Date
}

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}
