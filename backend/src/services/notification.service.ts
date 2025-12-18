import { Notification } from "../models/Notification.model"

export class NotificationService {

  async createNotification(data: {
    userId: string
    message: string
    type: "task_assigned" | "task_updated" | "task_completed"
    taskId: string
  }) {
    const notification = await Notification.create(data)
    return notification
  }

  async getUserNotifications(userId: string) {
    const notifications = await Notification.find({ userId })
      .populate("taskId", "title")
      .sort({ createdAt: -1 })
      .limit(50)

    return notifications
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true },
    )

    if (!notification) {
      throw new Error("Notification not found")
    }

    return notification
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany({ userId, read: false }, { read: true })

    return { message: "All notifications marked as read" }
  }

  async getUnreadCount(userId: string) {
    const count = await Notification.countDocuments({ userId, read: false })
    return count
  }
}
