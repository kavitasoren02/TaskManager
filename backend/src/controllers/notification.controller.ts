import type { Response } from "express"
import { NotificationService } from "../services/notification.service"
import type { AuthRequest } from "../types"
import { io } from "../server"
import { emitNotification } from "../socket/socket"

const notificationService = new NotificationService()

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user!.userId)
    res.status(200).json(notifications)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await notificationService.markAsRead(req.params.id as string, req.user!.userId)
    emitNotification(io, req.user!.userId, notification)
    res.status(200).json(notification)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await notificationService.markAllAsRead(req.user!.userId)
    emitNotification(io, req.user!.userId, result)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await notificationService.getUnreadCount(req.user!.userId)
    res.status(200).json({ count })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
