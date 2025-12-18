import type { Request, Response } from "express"
import { AuthService } from "../services/auth.service"
import type { AuthRequest } from "../types"

const authService = new AuthService()

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.register(req.body)

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      message: "User registered successfully",
      user: result.user,
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body)

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      message: "Login successful",
      user: result.user,
    })
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token")
  res.status(200).json({ message: "Logout successful" })
}

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.getProfile(req.user!.userId)
    res.status(200).json(user)
  } catch (error: any) {
    res.status(404).json({ message: error.message })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.updateProfile(req.user!.userId, req.body)
    res.status(200).json({
      message: "Profile updated successfully",
      user,
    })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await authService.getAllUsers()
    res.status(200).json(users)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
