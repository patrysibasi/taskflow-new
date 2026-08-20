import { Router } from "express"

import {
    getUsers,
    getUserById
} from "../controllers/users.controller.js"

import { authMiddleware } from "../middleware/auth.middleware.js"
import { requireAdmin } from "../middleware/requireAdmin.js"

const router = Router()

router.use(authMiddleware)
router.use(requireAdmin)

router.get("/", getUsers)

router.get("/:id", getUserById)

export default router