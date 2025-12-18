import useSWR from "swr"
import { api } from "../lib/api"
import type { Notification } from "../types"

const fetcher = (url: string) => api.get(url).then((res) => res.data)

export const useNotifications = () => {
  const { data, error, isLoading, mutate } = useSWR<Notification[]>("/notifications", fetcher)

  return {
    notifications: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export const useUnreadCount = () => {
  const { data, error, isLoading, mutate } = useSWR<{ count: number }>("/notifications/unread-count", fetcher)

  return {
    count: data?.count || 0,
    isLoading,
    isError: error,
    mutate,
  }
}
