import { pool } from "../db/database.js"
import { hashPassword } from "../utils/password.js"

export async function getUsers() {
    const result = await pool.query(
        `
        SELECT id, name, email, role, created_at
        FROM users
        ORDER BY id
        `
    )

    return result.rows
}

export async function getUserById(id: number) {
    const result = await pool.query(
        `
        SELECT id, name, email, role, created_at
        FROM users
        WHERE id = $1
        `,
        [id]
    )

    return result.rows[0] ?? null
}

export async function createUser(
    name: string,
    email: string,
    password: string,
    role: "employee" | "admin"
) {
    const passwordHash = await hashPassword(password)

    const result = await pool.query(
        `
        INSERT INTO users (
            name,
            email,
            password_hash,
            role
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at
        `,
        [name, email, passwordHash, role]
    )

    return result.rows[0]
}