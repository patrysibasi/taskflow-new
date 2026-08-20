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
    <main>
      <h1>TaskFlow</h1>

      <h2>Logowanie</h2>

      <form onSubmit={handleSubmit}>
        <div>
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
          />
        </div>

        <div>
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
          />
        </div>

        <button type="submit">
          Zaloguj
        </button>
      </form>

      {error && (
        <p>
          {error}
        </p>
      )}
    </main>
  )
}

export default LoginPage
