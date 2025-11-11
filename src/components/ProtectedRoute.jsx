"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) return <div>Cargando...</div>

  if (!user) return <Navigate to="/login" />

  if (requiredRole && user.rol !== requiredRole && !requiredRole.includes(user.rol)) {
    return <Navigate to="/" />
  }

  return children
}
