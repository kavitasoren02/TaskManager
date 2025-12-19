import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes"
import taskRoutes from "./routes/task.routes"
import notificationRoutes from "./routes/notification.routes"

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://task-management-kavita.netlify.app",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/notifications", notificationRoutes)

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

export default app
