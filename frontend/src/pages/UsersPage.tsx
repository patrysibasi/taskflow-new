import { useEffect, useState } from "react"

import type { User } from "../types/user"

import { getUsers } from "../services/userService"

function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers()

        setUsers(data)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Nie udało się pobrać użytkowników")
        }
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  if (loading) {
    return <p>Ładowanie użytkowników...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <main>
      <h1>Użytkownicy</h1>

      {users.length === 0 ? (
        <p>Brak użytkowników</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong>

              <p>
                Email: {user.email}
              </p>

              <p>
                ID: {user.id}
              </p>

              <p>
                Utworzono: {user.created_at}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default UsersPage
