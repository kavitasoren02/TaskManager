import { z } from "zod"

export const RegisterDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const LoginDto = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const UpdateProfileDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
})

export type RegisterDtoType = z.infer<typeof RegisterDto>
export type LoginDtoType = z.infer<typeof LoginDto>
export type UpdateProfileDtoType = z.infer<typeof UpdateProfileDto>
