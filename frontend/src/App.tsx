import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import TasksPage from "./pages/TasksPage"
import UsersPage from "./pages/UsersPage"

import ProtectedRoute from "./components/auth/ProtectedRoute"
import AdminRoute from "./components/auth/AdminRoute"
import ProtectedLayout from "./components/layout/ProtectedLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/tasks"
              element={<TasksPage />}
            />

            <Route element={<AdminRoute />}>
              <Route
                path="/users"
                element={<UsersPage />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
