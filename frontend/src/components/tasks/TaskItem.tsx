import { useState } from "react"
import type { ChangeEvent } from "react"

import type { Task, TaskStatus } from "../../types/task"

import {
  deleteTask,
  updateTask
} from "../../services/taskService"

interface TaskItemProps {
  task: Task,
  userName: string,
  onTaskDeleted: (taskId: number) => void
  onTaskUpdated: (task: Task) => void
}

function TaskItem({
  task,
  userName,
  onTaskDeleted,
  onTaskUpdated
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    try {
      setLoading(true)

      await deleteTask(task.id)

      onTaskDeleted(task.id)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("Nie udało się usunąć zadania")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const status = event.target.value as TaskStatus

    try {
      setLoading(true)

      const updatedTask = await updateTask(
        task.id,
        { status }
      )

      onTaskUpdated(updatedTask)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("Nie udało się zmienić statusu")
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveTitle() {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      alert("Tytuł zadania jest wymagany")
      return
    }

    try {
      setLoading(true)

      const updatedTask = await updateTask(
        task.id,
        {
          title: trimmedTitle
        }
      )

      onTaskUpdated(updatedTask)

      setIsEditing(false)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("Nie udało się zmienić tytułu")
      }
    } finally {
      setLoading(false)
    }
  }

  function handleCancelEdit() {
    setTitle(task.title)
    setIsEditing(false)
  }

  return (
    <article>
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            disabled={loading}
          />

          <button
            onClick={handleSaveTitle}
            disabled={loading}
          >
            Zapisz
          </button>

          <button
            onClick={handleCancelEdit}
            disabled={loading}
          >
            Anuluj
          </button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>

          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            Edytuj
          </button>
        </>
      )}

      <p>
        Status:
      </p>

      <select
        value={task.status}
        onChange={handleStatusChange}
        disabled={loading}
      >
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

      <p>
        Przypisane do użytkownika: {userName}
      </p>

      <p>
        Termin:{" "}
        {task.due_date ?? "Brak terminu"}
      </p>

      <button
        onClick={handleDelete}
        disabled={loading}
      >
        Usuń
      </button>
    </article>
  )
}

export default TaskItem

