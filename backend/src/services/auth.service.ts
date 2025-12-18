import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/User.model"
import type { RegisterDtoType, LoginDtoType, UpdateProfileDtoType } from "../dto/auth.dto"

export class AuthService {
  async register(data: RegisterDtoType) {
    const existingUser = await User.findOne({ email: data.email })

    if (existingUser) {
      throw new Error("User already exists with this email")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })

    const token = this.generateToken(user._id.toString(), user.email)

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    }
  }

  async login(data: LoginDtoType) {
    const user = await User.findOne({ email: data.email })

    if (!user) {
      throw new Error("Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new Error("Invalid email or password")
    }

    const token = this.generateToken(user._id.toString(), user.email)

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    }
  }

  async updateProfile(userId: string, data: UpdateProfileDtoType) {
    const user = await User.findByIdAndUpdate(userId, { name: data.name }, { new: true })

    if (!user) {
      throw new Error("User not found")
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    }
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId).select("-password")

    if (!user) {
      throw new Error("User not found")
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    }
  }

  async getAllUsers() {
    const users = await User.find().select("-password")
    return users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
    }))
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })
  }
}
