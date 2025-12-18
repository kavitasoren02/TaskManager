import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useUsers } from "../hooks/useUsers"
import type { Task } from "../types"

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  assignedToId: z.string().nullable().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  task?: Task
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isLoading = false }) => {
  const { users } = useUsers()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate.split("T")[0],
          priority: task.priority,
          assignedToId: task.assignedToId?.id || null,
        }
      : {
          priority: "Medium",
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground">
          Title
        </label>
        <input
          {...register("title")}
          type="text"
          id="title"
          className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          placeholder="Enter task title"
        />
        {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={4}
          className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          placeholder="Enter task description"
        />
        {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-foreground">
            Due Date
          </label>
          <input
            {...register("dueDate")}
            type="date"
            id="dueDate"
            className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 [color-scheme:dark]"
          />
          {errors.dueDate && <p className="mt-1 text-sm text-destructive">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-foreground">
            Priority
          </label>
          <select
            {...register("priority")}
            id="priority"
            className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          {errors.priority && <p className="mt-1 text-sm text-destructive">{errors.priority.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="assignedToId" className="block text-sm font-medium text-foreground">
          Assign To
        </label>
        <select
          {...register("assignedToId")}
          id="assignedToId"
          className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="">Unassigned</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        {errors.assignedToId && <p className="mt-1 text-sm text-destructive">{errors.assignedToId.message}</p>}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2 font-medium text-foreground transition-colors hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
