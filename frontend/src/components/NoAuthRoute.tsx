import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface NoAuthRouteProps {
    children: React.ReactNode
}

export const NoAuthRoute: React.FC<NoAuthRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }
    if(user){
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}
