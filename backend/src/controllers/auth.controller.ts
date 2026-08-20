import type { Response } from "express"
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js"

import {
    registerUser as registerUserFromService,
    loginUser as loginUserFromService,
    getUserById as getUserByIdFromService
} from "../services/auth.service.js"

import { generateToken } from "../utils/jwt.js"

export async function registerUser(
    req: AuthenticatedRequest,
    res: Response
) {
    const { name, email, password } = req.body

    const user = await registerUserFromService(
        name,
        email,
        password
    )

    res.status(201).json(user)
}

export async function loginUser(
    req: AuthenticatedRequest,
    res: Response
) {
    const { email, password } = req.body

    const user = await loginUserFromService(
        email,
        password
    )

    if (!user) {
        res.status(401).json({
            message: "Nieprawidłowy email lub hasło"
        })

        return
    }

    const token = generateToken(
        user.id,
        user.role
)

    res.json({
        user,
        token
    })
}

export async function getMe(
    req: AuthenticatedRequest,
    res: Response
) {
    const userId = req.userId

    if (!userId) {
        res.status(401).json({
            message: "Brak uwierzytelnionego użytkownika"
        })

        return
    }

    const user = await getUserByIdFromService(userId)

    if (!user) {
        res.status(404).json({
            message: "Użytkownik nie został znaleziony"
        })

        return
    }

    res.json(user)
}