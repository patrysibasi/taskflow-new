import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../context/AuthContext"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")

    try {
      await login(email, password)

      navigate("/dashboard")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Nie udało się zalogować")
      }
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-heading">
          <span>Witaj ponownie</span>

          <h1>TaskFlow</h1>

          <p>
            Zaloguj się, aby przejść do panelu
            zarządzania zadaniami.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">
              Hasło
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
            />
          </div>

          <button
            className="login-button"
            type="submit"
          >
            Zaloguj
          </button>
        </form>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}
      </section>
    </main>
  )
}

export default LoginPage
