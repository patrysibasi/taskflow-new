import { useEffect, useState } from "react"

import type { Task } from "../types/task"

import { useAuth } from "../context/AuthContext"

import { getTasks } from "../services/taskService"

function DashboardPage() {
  const { user, logout } = useAuth()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks()

        setTasks(data)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(
            "Nie udało się pobrać zadań"
          )
        }
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  if (loading) {
    return <p>Ładowanie dashboardu...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length

  return (
    <main>
      <header>
        <h1>TaskFlow</h1>

        {user && (
          <>
            <p>
              Zalogowany jako: {user.name}
            </p>

            <p>{user.email}</p>

            <p>
              Rola: {user.role}
            </p>

            <button onClick={logout}>
              Wyloguj
            </button>
          </>
        )}
      </header>

      <section>
        <h2>Dashboard</h2>

        <p>
          Wszystkie zadania: {tasks.length}
        </p>

        <p>
          Oczekujące: {pendingTasks}
        </p>

        <p>
          W trakcie: {inProgressTasks}
        </p>

        <p>
          Ukończone: {completedTasks}
        </p>
      </section>
    </main>
  )
}

export default DashboardPage