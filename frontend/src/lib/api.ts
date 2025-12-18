import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "/api"

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !["/auth/profile", "/auth/login"].includes(error.config.url)) {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)
