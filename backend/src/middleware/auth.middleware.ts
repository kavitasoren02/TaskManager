import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import type { AuthRequest } from "../types"

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({ message: "Authentication required" })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as {
      userId: string
      email: string
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}
