import type { Response } from "express"
import { TaskService } from "../services/task.service"
import type { AuthRequest } from "../types"
import { io } from "../server"
import { emitTaskUpdate } from "../socket/socket"

const taskService = new TaskService()

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await taskService.createTask(req.user!.userId, req.body)
    emitTaskUpdate(io, task)
    res.status(201).json({
      message: "Task created successfully",
      task,
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, priority, assignedToId, creatorId } = req.query

    const tasks = await taskService.getTasks({
      status: status as string,
      priority: priority as string,
      assignedToId: assignedToId as string,
      creatorId: creatorId as string,
    })

    res.status(200).json(tasks)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await taskService.getTaskById(req.params.id as string)
    res.status(200).json(task)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await taskService.updateTask(req.params.id as string, req.user!.userId, req.body)
    emitTaskUpdate(io, task)
    res.status(200).json({
      message: "Task updated successfully",
      task,
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await taskService.deleteTask(req.params.id as string, req.user!.userId)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(403).json({ message: error.message })
  }
}

export const getOverdueTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await taskService.getOverdueTasks(req.user!.userId)
    res.status(200).json(tasks)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
