import type { User } from "../types/user"
import { apiFetch } from "./api"

export async function getUsers(): Promise<User[]> {
  return apiFetch<User[]>("/users")
}

export async function getUserById(id: number): Promise<User> {
  return apiFetch<User>(`/users/${id}`)
}