import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
    email: z.string().email("Nieprawidłowy adres email"),
    password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków")
})

export const loginSchema = z.object({
    email: z.string().email("Nieprawidłowy adres email"),
    password: z.string().min(1, "Hasło jest wymagane")
})