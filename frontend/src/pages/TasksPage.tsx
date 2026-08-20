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

import TaskList from "../components/tasks/TaskList"
import CreateTaskForm from "../components/tasks/CreateTaskForm"

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])

  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null)

  const [selectedStatus, setSelectedStatus] =
    useState<TaskStatus | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadData() {
      try {
        const [tasksData, usersData] =
          await Promise.all([
            getTasks(),
            getUsers()
          ])

        setTasks(tasksData)
        setUsers(usersData)
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
  }, [])

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
    return <p>Ładowanie zadań...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <main>
      <h1>Zadania</h1>

      <CreateTaskForm
        onTaskCreated={handleTaskCreated}
      />

      <section>
        <h2>Filtrowanie</h2>

        <div>
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

        <div>
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

      {filteredTasks.length === 0 ? (
        <p>
          Brak zadań spełniających wybrane
          kryteria
        </p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          users={users}
          onTaskDeleted={handleTaskDeleted}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </main>
  )
}

export default TasksPage
