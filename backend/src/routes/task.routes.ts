import { Router } from "express"
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getOverdueTasks,
} from "../controllers/task.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { validateRequest } from "../middleware/validation.middleware"
import { CreateTaskDto, UpdateTaskDto } from "../dto/task.dto"

const router = Router()

router.post("/", authMiddleware, validateRequest(CreateTaskDto), createTask)
router.get("/", authMiddleware, getTasks)
router.get("/overdue", authMiddleware, getOverdueTasks)
router.get("/:id", authMiddleware, getTaskById)
router.put("/:id", authMiddleware, validateRequest(UpdateTaskDto), updateTask)
router.delete("/:id", authMiddleware, deleteTask)

export default router
