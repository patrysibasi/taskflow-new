import type { Response } from "express"
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js"

import {
    getUsers as getUsersFromService,
    getUserById as getUserByIdFromService,
    createUser as createUserFromService
} from "../services/users.service.js"

export async function getUsers(
    req: AuthenticatedRequest,
    res: Response
) {
    const users = await getUsersFromService()

    res.json(users)
}

export async function getUserById(
    req: AuthenticatedRequest,
    res: Response
) {
    const id = Number(req.params.id)

    const user = await getUserByIdFromService(id)

    if (!user) {
        res.status(404).json({
            message: "Użytkownik nie został znaleziony"
        })

        return
    }

    res.json(user)
}

export async function createUser(
    req: AuthenticatedRequest,
    res: Response
) {
    const { name, email, password, role } = req.body

    const user = await createUserFromService(
        name,
        email,
        password,
        role
    )

    res.status(201).json(user)
}