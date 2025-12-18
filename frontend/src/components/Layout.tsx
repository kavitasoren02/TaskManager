import type React from "react"
import { useCallback } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useUnreadCount } from "../hooks/useNotifications"
import { useRealtimeNotifications } from "../hooks/useRealtime"
import { LogOut, Bell, LayoutDashboard, ListTodo, User } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const { count, mutate } = useUnreadCount()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNewNotification = useCallback(() => {
    mutate()
  }, [mutate])

  useRealtimeNotifications(handleNewNotification)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <ListTodo className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">TaskFlow</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive("/tasks")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <ListTodo className="h-4 w-4" />
                Tasks
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/notifications"
                className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
