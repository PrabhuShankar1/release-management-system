import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link
} from "react-router-dom"

import Login from "./pages/Login"
import Releases from "./pages/Releases"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"

import RoleProtectedRoute from "./ProtectedRoute"
import { logout, getRole, isLoggedIn } from "./auth"

function App() {
  const role = getRole()

  return (
    <BrowserRouter>

      {isLoggedIn() && (
        <nav style={{ padding: 10 }}>

          {/* Worker only sees Tasks */}
          {role !== "Worker" && (
            <>
              <Link to="/releases">Releases</Link> |{" "}
              <Link to="/dashboard">Dashboard</Link> |{" "}
            </>
          )}

          <Link to="/tasks">Tasks</Link> |{" "}
          <button onClick={logout}>Logout</button>
        </nav>
      )}

      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        {/* ADMIN + MANAGER */}
        <Route
          path="/releases"
          element={
            <RoleProtectedRoute roles={["Admin", "Manager"]}>
              <Releases />
            </RoleProtectedRoute>
          }
        />

        {/* ADMIN ONLY */}
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute roles={["Admin"]}>
              <Dashboard />
            </RoleProtectedRoute>
          }
        />

        {/* ALL ROLES */}
        <Route
          path="/tasks"
          element={
            <RoleProtectedRoute roles={["Admin", "Manager", "Worker"]}>
              <Tasks />
            </RoleProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App