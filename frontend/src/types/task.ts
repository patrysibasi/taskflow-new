export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"


export interface Task {
  id: number
  user_id: number
  user_name: string
  title: string
  status: TaskStatus
  created_at: string
  due_date: string | null
}