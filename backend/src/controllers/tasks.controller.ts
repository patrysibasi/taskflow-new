import type { Response } from "express"
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js"

import {
    getTasks as getTasksFromService,
    createTask as createTaskFromService,
    getTaskById as getTaskByIdFromService,
    updateTask as updateTaskFromService,
    deleteTask as deleteTaskFromService
} from "../services/tasks.service.js"

import { getAuthenticatedUser } from "../utils/auth.js"


export async function getTasks(
    req: AuthenticatedRequest,
    res: Response
) {
    const authUser = getAuthenticatedUser(req)

    if (!authUser) {
        res.status(401).json({
            message: "Brak uwierzytelnionego użytkownika"
        })

        return
    }

    const tasks = await getTasksFromService(
        authUser.userId,
        authUser.role
    )

    res.json(tasks)
}


export async function createTask(
    req: AuthenticatedRequest,
    res: Response
) {
    const authUser = getAuthenticatedUser(req)

    if (!authUser) {
        res.status(401).json({
            message: "Brak uwierzytelnionego użytkownika"
        })

        return
    }

    const {
        title,
        userId: requestedUserId,
        dueDate
    } = req.body

    let taskUserId = authUser.userId

    if (
        authUser.role === "admin" &&
        requestedUserId
    ) {
        taskUserId = requestedUserId
    }

    const task = await createTaskFromService(
        title,
        taskUserId,
        dueDate
    )

    res.status(201).json(task)
}


export async function getTaskById(
    req: AuthenticatedRequest,
    res: Response
) {
    const authUser = getAuthenticatedUser(req)

    if (!authUser) {
        res.status(401).json({
            message: "Brak uwierzytelnionego użytkownika"
        })

        return
    }

    const id = Number(req.params.id)

    const task = await getTaskByIdFromService(
        id,
        authUser.userId,
        authUser.role
    )

    if (!task) {
        res.status(404).json({
            message: "Zadanie nie zostało znalezione"
        })

        return
    }

    res.json(task)
}


export async function updateTask(
    req: AuthenticatedRequest,
    res: Response
) {
    const authUser = getAuthenticatedUser(req)

    if (!authUser) {
        res.status(401).json({
            message: "Brak uwierzytelnionego użytkownika"
        })

        return
    }

    const {
        title,
        status,
        dueDate
    } = req.body

    const id = Number(req.params.id)

    const task = await updateTaskFromService(
        id,
        authUser.userId,
        authUser.role,
        title,
        status,
        dueDate
    )

    if (!task) {
        res.status(404).json({
            message: "Zadanie nie zostało znalezione"
        })

        return
    }

    res.json(task)
}


export async function deleteTask(
    req: AuthenticatedRequest,
    res: Response
) {
    const authUser = getAuthenticatedUser(req)

    if (!authUser) {
        res.status(401).json({
            message: "Brak uwierzytelnionego użytkownika"
        })

        return
    }

    const id = Number(req.params.id)

    const task = await deleteTaskFromService(
        id,
        authUser.userId,
        authUser.role
    )

    if (!task) {
        res.status(404).json({
            message: "Zadanie nie zostało znalezione"
        })

        return
    }

    res.json({
        message: "Zadanie zostało usunięte",
        task
    })
}