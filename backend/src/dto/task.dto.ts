import { z } from "zod"

export const CreateTaskDto = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  assignedToId: z.string().optional().nullable(),
})

export const UpdateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).optional(),
  dueDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .optional(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
  status: z.enum(["To Do", "In Progress", "Review", "Completed"]).optional(),
  assignedToId: z.string().optional().nullable(),
})

export type CreateTaskDtoType = z.infer<typeof CreateTaskDto>
export type UpdateTaskDtoType = z.infer<typeof UpdateTaskDto>
