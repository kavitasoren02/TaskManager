import type React from "react"
import { useCallback } from "react"
import { Layout } from "../components/Layout"
import { useNotifications } from "../hooks/useNotifications"
import { useRealtimeNotifications } from "../hooks/useRealtime"
import { api } from "../lib/api"
import { format } from "date-fns"
import { Bell, Check, CheckCheck } from "lucide-react"
import { Link } from "react-router-dom"

export const Notifications: React.FC = () => {
  const { notifications, isLoading, mutate } = useNotifications()

  const handleNewNotification = useCallback(() => {
    console.log(" Real-time notification received on notifications page")
    mutate()
  }, [mutate])

  useRealtimeNotifications(handleNewNotification)

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      mutate()
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all")
      mutate()
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="mt-2 text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-card"></div>
            ))}
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-lg border p-4 transition-colors ${
                  notification.read ? "border-border bg-card" : "border-primary/30 bg-primary/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                      notification.read ? "bg-muted" : "bg-primary/20"
                    }`}
                  >
                    <Bell className={`h-5 w-5 ${notification.read ? "text-muted-foreground" : "text-primary"}`} />
                  </div>

                  <div className="flex-1">
                    <Link to={`/tasks/${notification.taskId._id}`} className="block hover:underline">
                      <p className={`font-medium ${notification.read ? "text-muted-foreground" : "text-foreground"}`}>
                        {notification.message}
                      </p>
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {format(new Date(notification.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-12">
            <Bell className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">No notifications</p>
            <p className="mt-1 text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
