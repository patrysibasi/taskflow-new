import { z } from "zod"
import type { NextFunction, Request, Response } from "express"
import type { ZodType } from "zod"

export function validate(schema: ZodType) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({
                message: "Nieprawidłowe dane",
                errors: z.treeifyError(result.error)
            })

            return
        }

        req.body = result.data

        next()
    }
}