import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "../../context/AuthContext"

function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Sprawdzanie uprawnień...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute