import { pool } from "../db/database.js"

export async function getTasks(
) {
    const result = await pool.query(
        `
        SELECT 
            tasks.*,
            users.name AS user_name
        FROM tasks
        INNER JOIN users
            on users.id = tasks.user_id
        ORDER BY tasks.created_at DESC
        `
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
        INSERT INTO tasks (
            title,
            user_id,
            due_date
        )
        VALUES ($1, $2, $3)
        RETURNING id
        `,
        [
            title,
            userId,
            dueDate ?? null
        ]
    )

    const task = result.rows[0]

    if (!task) {
        throw new Error(
            "Nie udało się utworzyć zadania"
        )
    }

    const taskWithUser = await pool.query(
        `
        SELECT
            tasks.*,
            users.name AS user_name
        FROM tasks
        INNER JOIN users
            ON users.id = tasks.user_id
        WHERE tasks.id = $1
        `,
        [task.id]
    )

    return taskWithUser.rows[0] ?? null
}

export async function getTaskById(
    id: number,
) {
    const result = await pool.query(
        `
        SELECT 
            tasks.*,
            users.name as user_name
        FROM tasks
        INNER JOIN
            users on tasks.user_id = users.id
        WHERE tasks.id = $1
        `,
        [id]
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
        RETURNING id
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

    const task = result.rows[0]

    if (!task) {
        return null
    }

    const taskWithUser = await pool.query(
        `
        SELECT
            tasks.*,
            users.name AS user_name
        FROM tasks
        INNER JOIN users
            ON users.id = tasks.user_id
        WHERE tasks.id = $1
        `,
        [task.id]
    )

    return taskWithUser.rows[0] ?? null
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