import { useState } from "react"
import { createTask } from "../../services/taskService"
import type { Task } from "../../types/task"

interface CreateTaskFormProps {
  onTaskCreated: (task: Task) => void
}

function CreateTaskForm({
  onTaskCreated
}: CreateTaskFormProps) {
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
        dueDate || undefined
      )

      onTaskCreated(task)

      setTitle("")
      setDueDate("")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Nie udało się utworzyć zadania")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
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
        />
      </div>

      <div>
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

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? "Tworzenie..." : "Dodaj zadanie"}
      </button>

      {error && (
        <p>{error}</p>
      )}
    </form>
  )
}

export default CreateTaskForm