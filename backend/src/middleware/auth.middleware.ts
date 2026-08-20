import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

function getJwtSecret() {
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error("JWT_SECRET nie jest ustawiony")
    }

    return secret
}

export interface AuthenticatedRequest extends Request {
    userId?: number
    role?: "admin" | "employee"
}

export function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization

    if (!authorization) {
        res.status(401).json({
            message: "Brak tokenu"
        })

        return
    }

    const [type, token] = authorization.split(" ")

    if (type !== "Bearer" || !token) {
        res.status(401).json({
            message: "Nieprawidłowy format tokenu"
        })

        return
    }

    try {
        const payload = jwt.verify(token, getJwtSecret())

        if (
            typeof payload !== "object" ||
            payload === null ||
            typeof payload.userId !== "number" ||
            (payload.role !== "admin" && payload.role !== "employee")
        ) {
            res.status(401).json({
                message: "Nieprawidłowy token"
            })

            return
        }

        req.userId = payload.userId
        req.role = payload.role

        next()
    } catch {
        res.status(401).json({
            message: "Nieprawidłowy lub wygasły token"
        })
    }
}