import type { Task } from "../types/task"

import { apiFetch } from "./api"

export async function getTasks(): Promise<Task[]> {
  return apiFetch<Task[]>("/tasks")
}

export async function getTaskById(
  id: number
): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`)
}

export async function createTask(
  title: string,
  dueDate?: string,
  userId?: number
): Promise<Task> {
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({
      title,
      dueDate,
      userId
    })
  })
}

export async function updateTask(
  id: number,
  data: {
    title?: string
    status?: "pending" | "in_progress" | "completed"
    dueDate?: string
  }
): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

export async function deleteTask(
  id: number
): Promise<void> {
  await apiFetch(`/tasks/${id}`, {
    method: "DELETE"
  })
}