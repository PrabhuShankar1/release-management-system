import { Navigate } from "react-router-dom"
import { getRole, isLoggedIn } from "./auth"

export default function RoleProtectedRoute({ children, roles }: any) {
  if (!isLoggedIn()) return <Navigate to="/login" />

  const role = getRole()

  if (!roles.includes(role)) {
    return <Navigate to="/tasks" /> // fallback page
  }

  return children
}