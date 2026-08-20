export type UserRole = "admin" | "employee"

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  created_at: string
}
