import type { LoginResponse} from "../types/auth"
import type { User } from "../types/user"
import { apiFetch } from "./api"

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  })

  localStorage.setItem("token", data.token)

  return data
}

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>("/auth/me")
}

export function logout() {
  localStorage.removeItem("token")
}

export function getToken(): string | null {
  return localStorage.getItem("token")
}