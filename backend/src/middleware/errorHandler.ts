import type { NextFunction, Request, Response } from "express"

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(error)

    res.status(500).json({
        message: "Wystąpił błąd serwera"
    })
}