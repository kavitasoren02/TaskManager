import { Router } from "express"
import { register, login, logout, getProfile, updateProfile, getAllUsers } from "../controllers/auth.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { validateRequest } from "../middleware/validation.middleware"
import { RegisterDto, LoginDto, UpdateProfileDto } from "../dto/auth.dto"

const router = Router()

router.post("/register", validateRequest(RegisterDto), register)
router.post("/login", validateRequest(LoginDto), login)
router.post("/logout", authMiddleware, logout)
router.get("/profile", authMiddleware, getProfile)
router.put("/profile", authMiddleware, validateRequest(UpdateProfileDto), updateProfile)
router.get("/users", authMiddleware, getAllUsers)

export default router
