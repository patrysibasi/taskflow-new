import { useEffect, useState } from "react"

import type { Task } from "../types/task"

import { useAuth } from "../context/AuthContext"

import { getTasks } from "../services/taskService"

function DashboardPage() {
  const { user } = useAuth()

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
    return (
      <main className="dashboard-page">
        <div className="dashboard-state">
          Ładowanie dashboardu...
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-state dashboard-state-error">
          {error}
        </div>
      </main>
    )
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
    <main className="dashboard-page">
      <section className="dashboard-heading">
        <span className="page-eyebrow">
          TASKFLOW
        </span>

        <h1>Dashboard</h1>

        {user && (
          <p>
            Witaj ponownie,{" "}
            <strong>{user.name}</strong>
          </p>
        )}
      </section>

      {user && (
        <section className="dashboard-user">
          <div className="dashboard-user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="dashboard-user-info">
            <span>AKTYWNY UŻYTKOWNIK</span>

            <strong>{user.name}</strong>

            <p>{user.email}</p>
          </div>

          <div className="dashboard-user-role">
            <span>ROLA</span>

            <strong>{user.role}</strong>
          </div>
        </section>
      )}

      <section className="dashboard-stats">
        <div className="dashboard-stat dashboard-stat-total">
          <span className="dashboard-stat-label">
            WSZYSTKIE ZADANIA
          </span>

          <strong>{tasks.length}</strong>

          <p>Łączna liczba zadań</p>
        </div>

        <div className="dashboard-stat dashboard-stat-pending">
          <span className="dashboard-stat-label">
            OCZEKUJĄCE
          </span>

          <strong>{pendingTasks}</strong>

          <p>Zadania do wykonania</p>
        </div>

        <div className="dashboard-stat dashboard-stat-progress">
          <span className="dashboard-stat-label">
            W TRAKCIE
          </span>

          <strong>{inProgressTasks}</strong>

          <p>Aktualnie realizowane</p>
        </div>

        <div className="dashboard-stat dashboard-stat-completed">
          <span className="dashboard-stat-label">
            UKOŃCZONE
          </span>

          <strong>{completedTasks}</strong>

          <p>Zadania zakończone</p>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage