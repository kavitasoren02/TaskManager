import http from "http"
import app from "./app"
import { connectDB } from "./config/database"
import { initSocket } from "./socket/socket"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 5000

const httpServer = http.createServer(app)

export const io = initSocket(httpServer)

const startServer = async () => {
  try {
    await connectDB()

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
