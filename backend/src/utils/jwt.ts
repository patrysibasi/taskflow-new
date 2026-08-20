import jwt from "jsonwebtoken"

function getJwtSecret() {
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error("JWT_SECRET nie jest ustawiony")
    }

    return secret
}

export function generateToken(
    userId: number,
    role: "admin" | "employee"
) {
    const token = jwt.sign(
        {
            userId,
            role
        },
        getJwtSecret(),
        {
            expiresIn: "1h"
        }
    )

    return token
}