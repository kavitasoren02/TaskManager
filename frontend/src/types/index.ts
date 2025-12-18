export interface User {
  id: string
  name: string
  email: string
}

export interface Task {
  _id: string
  title: string
  description: string
  dueDate: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  status: "To Do" | "In Progress" | "Review" | "Completed"
  creatorId: User
  assignedToId: User | null
  createdAt: string
  updatedAt: string
}

export interface Notification {
  _id: string
  userId: string
  message: string
  type: "task_assigned" | "task_updated" | "task_completed"
  taskId: {
    _id: string
    title: string
  }
  read: boolean
  createdAt: string
}

export interface CreateTaskData {
  title: string
  description: string
  dueDate: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  assignedToId?: string | null
}

export interface UpdateTaskData {
  title?: string
  description?: string
  dueDate?: string
  priority?: "Low" | "Medium" | "High" | "Urgent"
  status?: "To Do" | "In Progress" | "Review" | "Completed"
  assignedToId?: string | null
}
