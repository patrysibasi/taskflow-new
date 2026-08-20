import type { User } from "./user"

export interface LoginResponse {
  user: User
  token: string
}
