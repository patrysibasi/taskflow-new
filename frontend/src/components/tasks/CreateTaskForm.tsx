import { useState } from "react"

import { createTask } from "../../services/taskService"

import type { Task } from "../../types/task"
import type { User } from "../../types/user"

import { useAuth } from "../../context/AuthContext"

interface CreateTaskFormProps {
  users: User[]
  onTaskCreated: (task: Task) => void
}

function CreateTaskForm({
  users,
  onTaskCreated
}: CreateTaskFormProps) {
  const { user } = useAuth()

  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isAdmin = user?.role === "admin"

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")

    if (!title.trim()) {
      setError("Tytuł zadania jest wymagany")
      return
    }

    try {
      setLoading(true)

      const task = await createTask(
        title.trim(),
        dueDate || undefined,
        isAdmin
          ? selectedUserId ?? undefined
          : undefined
      )

      onTaskCreated(task)

      setTitle("")
      setDueDate("")
      setSelectedUserId(null)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          "Nie udało się utworzyć zadania"
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="create-task-form"
      onSubmit={handleSubmit}
    >
      <div className="create-task-field create-task-title">
        <label htmlFor="title">
          Tytuł zadania
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          disabled={loading}
          placeholder="Wpisz nazwę zadania..."
        />
      </div>

      <div className="create-task-field create-task-date">
        <label htmlFor="dueDate">
          Termin
        </label>

        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(event) =>
            setDueDate(event.target.value)
          }
          disabled={loading}
        />
      </div>

      {isAdmin && (
        <div className="create-task-field create-task-user">
          <label htmlFor="task-user">
            Przypisz do
          </label>

          <select
            id="task-user"
            value={
              selectedUserId === null
                ? ""
                : selectedUserId
            }
            onChange={(event) => {
              const value = event.target.value

              setSelectedUserId(
                value === ""
                  ? null
                  : Number(value)
              )
            }}
            disabled={loading}
          >
            <option value="">
              Wybierz użytkownika
            </option>

            {users
              .filter(
                (user) => user.role === "employee"
              )
              .map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name}
                </option>
              ))}
          </select>
        </div>
      )}

      <button
        className="create-task-button"
        type="submit"
        disabled={
          loading ||
          (isAdmin && selectedUserId === null)
        }
      >
        {loading
          ? "Tworzenie..."
          : "Dodaj zadanie"}
      </button>

      {error && (
        <p className="create-task-error">
          {error}
        </p>
      )}
    </form>
  )
}

export default CreateTaskForm