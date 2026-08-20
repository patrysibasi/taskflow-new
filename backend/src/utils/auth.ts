import type { AuthenticatedRequest } from "../middleware/auth.middleware.js"

export function getAuthenticatedUser(
    req: AuthenticatedRequest
) {
    const userId = req.userId
    const role = req.role

    if (!userId || !role) {
        return null
    }

    return {
        userId,
        role
    }
}