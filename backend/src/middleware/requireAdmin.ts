import type { Response, NextFunction } from "express"
import type { AuthenticatedRequest } from "./auth.middleware.js"

export function requireAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    if (req.role !== "admin") {
        res.status(403).json({
            message: "Brak uprawnień administratora"
        })

        return
    }

    next()
}