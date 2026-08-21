import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent
} from "react"

import type {
  Task,
  TaskStatus
} from "../types/task"

import type { User } from "../types/user"

import { getTasks } from "../services/taskService"
import { getUsers } from "../services/userService"

import { useAuth } from "../context/AuthContext"

import TaskList from "../components/tasks/TaskList"
import CreateTaskForm from "../components/tasks/CreateTaskForm"

function TasksPage() {
  const { user } = useAuth()

  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])

  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null)

  const [selectedStatus, setSelectedStatus] =
    useState<TaskStatus | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    async function loadData() {
      try {
        const tasksData = await getTasks()

        setTasks(tasksData)

        if (isAdmin) {
          const usersData = await getUsers()
          setUsers(usersData)
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(
            "Nie udało się pobrać danych"
          )
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAdmin])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesUser =
        selectedUserId === null ||
        task.user_id === selectedUserId

      const matchesStatus =
        selectedStatus === null ||
        task.status === selectedStatus

      return matchesUser && matchesStatus
    })
  }, [
    tasks,
    selectedUserId,
    selectedStatus
  ])

  function handleTaskCreated(task: Task) {
    setTasks((currentTasks) => [
      task,
      ...currentTasks
    ])
  }

  function handleTaskDeleted(taskId: number) {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== taskId
      )
    )
  }

  function handleTaskUpdated(updatedTask: Task) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    )
  }

  function handleUserFilterChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const value = event.target.value

    setSelectedUserId(
      value === ""
        ? null
        : Number(value)
    )
  }

  function handleStatusFilterChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const value = event.target.value

    setSelectedStatus(
      value === ""
        ? null
        : value as TaskStatus
    )
  }

  if (loading) {
    return (
      <main>
        <p>Ładowanie zadań...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main className="tasks-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            TASK MANAGEMENT
          </span>

          <h1>Zadania</h1>

          <p>
            Zarządzaj zadaniami, terminami
            i ich realizacją.
          </p>
        </div>
      </div>

      <CreateTaskForm
        users={users}
        onTaskCreated={handleTaskCreated}
      />

      {isAdmin && (
        <section className="task-filters">
          <div className="task-filters-heading">
            <span>FILTERS</span>
            <h2>Filtrowanie</h2>
          </div>

          <div className="task-filter">
            <label htmlFor="user-filter">
              Użytkownik
            </label>

            <select
              id="user-filter"
              value={
                selectedUserId === null
                  ? ""
                  : selectedUserId
              }
              onChange={
                handleUserFilterChange
              }
            >
              <option value="">
                Wszyscy użytkownicy
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="task-filter">
            <label htmlFor="status-filter">
              Status
            </label>

            <select
              id="status-filter"
              value={
                selectedStatus ?? ""
              }
              onChange={
                handleStatusFilterChange
              }
            >
              <option value="">
                Wszystkie statusy
              </option>

              <option value="pending">
                Oczekujące
              </option>

              <option value="in_progress">
                W trakcie
              </option>

              <option value="completed">
                Ukończone
              </option>
            </select>
          </div>
        </section>
      )}

      {filteredTasks.length === 0 ? (
        <div className="empty-tasks">
          <strong>Brak zadań</strong>

          <span>
            Nie znaleziono zadań spełniających
            wybrane kryteria.
          </span>
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onTaskDeleted={handleTaskDeleted}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </main>
  )
}

export default TasksPage