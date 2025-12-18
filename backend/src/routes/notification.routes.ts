import { Router } from "express"
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notification.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

router.get("/", authMiddleware, getNotifications)
router.get("/unread-count", authMiddleware, getUnreadCount)
router.put("/:id/read", authMiddleware, markAsRead)
router.put("/read-all", authMiddleware, markAllAsRead)

export default router
