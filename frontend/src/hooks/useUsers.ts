import useSWR from "swr"
import { api } from "../lib/api"
import type { User } from "../types"

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export const useUsers = () => {
  const { data, error, isLoading } = useSWR<User[]>("/auth/users", fetcher)

  return {
    users: data,
    isLoading,
    isError: error,
  }
}
