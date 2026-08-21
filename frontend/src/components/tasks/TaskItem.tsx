import { useState } from "react"
import { useAuth } from "../../context/AuthContext"

import type { Task, TaskStatus } from "../../types/task"

import {
  deleteTask,
  updateTask
} from "../../services/taskService"

interface TaskItemProps {
  task: Task
  onTaskDeleted: (taskId: number) => void
  onTaskUpdated: (task: Task) => void
}

function TaskItem({
  task,
  onTaskDeleted,
  onTaskUpdated
}: TaskItemProps) {
  const { user } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [loading, setLoading] = useState(false)

  const canModify =
    user?.role === "admin" ||
    user?.id === task.user_id

  function formatDueDate(date: string | null) {
    if (!date) {
      return "Brak terminu"
    }

    return new Date(date).toLocaleDateString("pl-PL")
  }

  function getNextStatus(
    status: TaskStatus
  ): TaskStatus {
    if (status === "pending") {
      return "in_progress"
    }

    if (status === "in_progress") {
      return "completed"
    }

    return "pending"
  }

  function getStatusLabel(
    status: TaskStatus
  ) {
    if (status === "pending") {
      return "Oczekujące"
    }

    if (status === "in_progress") {
      return "W trakcie"
    }

    return "Ukończone"
  }

  async function handleStatusChange() {
    if (!canModify) {
      alert(
        "Możesz zmienić status tylko zadań przypisanych do Ciebie."
      )
    }

    const nextStatus = getNextStatus(task.status)

    try {
      setLoading(true)

      const updatedTask = await updateTask(
        task.id,
        {
          status: nextStatus
        }
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

  async function handleDelete() {
    if (!canModify) {
      alert(
        "Możesz usunąć tylko zadania przypisane do Ciebie."
      )
    }

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

  async function handleSaveTitle() {
    if (!canModify) {
      alert(
        "Możesz edytować tylko zadania przypisane do Ciebie."
      )
    }

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
    <article className="task-card">
      <div className="task-card-content">
        {isEditing ? (
          <div className="task-edit">
            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              disabled={loading}
            />

            <div className="task-edit-actions">
              <button
                type="button"
                onClick={handleSaveTitle}
                disabled={loading}
              >
                Zapisz
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Anuluj
              </button>
            </div>
          </div>
        ) : (
          <h3>{task.title}</h3>
        )}

        <div className="task-status">
          <span>Status</span>

          <button
            type="button"
            className={`status-button status-${task.status}`}
            onClick={handleStatusChange}
            disabled={loading || !canModify}
          >
            {getStatusLabel(task.status)}
          </button>
        </div>

        <div className="task-details">
          <div className="task-detail">
            <span>Przypisane do</span>
            <strong>{task.user_name}</strong>
          </div>

          <div className="task-detail">
            <span>Termin</span>
            <strong>
              {formatDueDate(task.due_date)}
            </strong>
          </div>
        </div>
      </div>

      <div className="task-actions">
        {canModify && !isEditing && (
          <button
            type="button"
            className="task-edit-button"
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            Edytuj
          </button>
        )}
        {canModify && ( 
          <button
            type="button"
            className="task-delete-button"
            onClick={handleDelete}
            disabled={loading}
          >
            Usuń
          </button>
        )}
      </div>
    </article>
  )
}

export default TaskItem
