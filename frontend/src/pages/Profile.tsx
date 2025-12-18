import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Layout } from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { User } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type ProfileFormData = z.infer<typeof profileSchema>

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      setError("")
      setSuccess(false)
      await updateProfile(data.name)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage your account information</p>
        </div>

        <div className="rounded-xl bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {success && (
              <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-500">Profile updated successfully!</div>
            )}

            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={user?.email}
                disabled
                className="mt-1 w-full rounded-lg border border-input bg-muted px-4 py-2 text-muted-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
