import { z } from "zod"

export const createTaskSchema = z.object({
    title: z.string().min(1, "Tytuł jest wymagany"),
    userId: z.number().int().positive().optional(),
    dueDate: z.string().optional()
})

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Tytuł jest wymagany").optional(),
    status: z.enum([
        "pending",
        "in_progress",
        "completed"
    ]).optional(),
    dueDate: z.string().optional()
})