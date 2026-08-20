import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"

import {
    registerUser,
    loginUser,
    getMe
} from "../controllers/auth.controller.js"

import { validate } from "../middleware/validate.js"

import {
    registerSchema,
    loginSchema
} from "../schemas/auth.schema.js"

const router = Router()

router.post(
    "/register",
    validate(registerSchema),
    registerUser
)

router.post(
    "/login",
    validate(loginSchema),
    loginUser
)

router.get(
    "/me",
    authMiddleware,
    getMe
)

export default router