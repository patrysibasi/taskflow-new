import { pool } from "../db/database.js"

export async function getTasks(
    userId: number,
    role: "admin" | "employee"
) {
    if (role === "admin") {
        const result = await pool.query(
            `
            SELECT *
            FROM tasks
            ORDER BY created_at DESC
            `
        )

        return result.rows
    }

    const result = await pool.query(
        `
        SELECT *
        FROM tasks
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    )

    return result.rows
}

export async function createTask(
    title: string,
    userId: number,
    dueDate?: string
) {
    const result = await pool.query(
        `
        INSERT INTO tasks (title, user_id, due_date)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [title, userId, dueDate ?? null]
    )

    return result.rows[0]
}

export async function getTaskById(
    id: number,
    userId: number,
    role: "admin" | "employee"
) {
    if (role === "admin") {
        const result = await pool.query(
            `
            SELECT *
            FROM tasks
            WHERE id = $1
            `,
            [id]
        )

        return result.rows[0] ?? null
    }

    const result = await pool.query(
        `
        SELECT *
        FROM tasks
        WHERE id = $1
          AND user_id = $2
        `,
        [id, userId]
    )

    return result.rows[0] ?? null
}

export async function updateTask(
    id: number,
    userId: number,
    role: "admin" | "employee",
    title?: string,
    status?: "pending" | "in_progress" | "completed",
    dueDate?: string
) {
    const result = await pool.query(
        `
        UPDATE tasks
        SET
            title = COALESCE($1, title),
            status = COALESCE($2, status),
            due_date = COALESCE($3, due_date)
        WHERE id = $4
          AND ($5 = 'admin' OR user_id = $6)
        RETURNING *
        `,
        [
            title,
            status,
            dueDate,
            id,
            role,
            userId
        ]
    )

    return result.rows[0] ?? null
}

export async function deleteTask(
    id: number,
    userId: number,
    role: "admin" | "employee"
) {
    const result = await pool.query(
        `
        DELETE FROM tasks
        WHERE id = $1
          AND ($2 = 'admin' OR user_id = $3)
        RETURNING *
        `,
        [
            id,
            role,
            userId
        ]
    )

    return result.rows[0] ?? null
}