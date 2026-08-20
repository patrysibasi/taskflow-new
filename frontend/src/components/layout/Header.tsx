import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../../context/AuthContext"

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <header>
      <div>
        <h1>TaskFlow</h1>

        <p>
          Panel zarządzania zadaniami
        </p>
      </div>

      {user && (
        <nav>
          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/tasks">
            Zadania
          </Link>

          {user.role === "admin" && (
            <Link to="/users">
              Użytkownicy
            </Link>
          )}

          <button onClick={handleLogout}>
            Wyloguj
          </button>
        </nav>
      )}
    </header>
  )
}

export default Header
