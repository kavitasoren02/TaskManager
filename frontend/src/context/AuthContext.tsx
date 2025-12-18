import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { api } from "../lib/api"
import type { User } from "../types"
import { initSocket, disconnectSocket } from "../lib/socket"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get("/auth/profile")
      setUser(response.data)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
    const socket = initSocket()
    socket.on("connect", () => {
      console.log("Socket connected")
    })
    socket.on("disconnect", () => {
      console.log("Socket disconnected")
    })
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
    })
    setIsLoading(false)
  }, [fetchProfile])

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password })
    setUser(response.data.user)
    initSocket()
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post("/auth/register", { name, email, password })
    const newToken = response.data.token || "dummy-token"
    setUser(response.data.user)
    localStorage.setItem("token", newToken)
    initSocket()
  }

  const logout = async () => {
    await api.post("/auth/logout")
    setUser(null)
    localStorage.removeItem("token")
    disconnectSocket()
  }

  const updateProfile = async (name: string) => {
    const response = await api.put("/auth/profile", { name })
    setUser(response.data.user)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
