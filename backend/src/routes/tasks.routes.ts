import { Router } from "express"
import { 
    getTasks, 
    createTask,
    getTaskById,
    updateTask,
    deleteTask 
} from "../controllers/tasks.controller.js"
import { validate } from "../middleware/validate.js"
import { 
    createTaskSchema,
    updateTaskSchema } from "../schemas/tasks.schema.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

router.use(authMiddleware)

router.get("/", getTasks)

router.get("/:id", getTaskById);

router.post(
    "/", 
    validate(createTaskSchema),
    createTask
)

router.patch(
    "/:id",
    validate(updateTaskSchema),
    updateTask
)

router.delete("/:id", deleteTask)


export default router