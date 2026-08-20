import { pool } from "../db/database.js"
import { hashPassword, comparePassword } from "../utils/password.js"

export async function registerUser(
    name: string,
    email: string,
    password: string
) {
    const passwordHash = await hashPassword(password)

    const result = await pool.query(
        `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, role, created_at
        `,
        [name, email, passwordHash]
    )

    return result.rows[0]
}

export async function loginUser(
    email: string,
    password: string
) {
    const result = await pool.query(
        `
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE email = $1
        `,
        [email]
    )

    const user = result.rows[0]

    if (!user) {
        return null
    }

    const passwordValid = await comparePassword(
        password,
        user.password_hash
    )

    if (!passwordValid) {
        return null
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
}

export async function getUserById(userId: number) {
    const result = await pool.query(
        `
        SELECT id, name, email, role, created_at
        FROM users
        WHERE id = $1
        `,
        [userId]
    )

    return result.rows[0] ?? null
}