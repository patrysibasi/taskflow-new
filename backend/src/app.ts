import express from "express"
import helmet from "helmet"
import cors from "cors"
import rateLimit from "express-rate-limit"

import tasksRouter from "./routes/tasks.routes.js"
import usersRouter from "./routes/users.routes.js"
import authRouter from "./routes/auth.routes.js"

import { errorHandler } from "./middleware/errorHandler.js"

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100
})

app.use(limiter)

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/users", usersRouter)
app.use("/tasks", tasksRouter)

app.get("/", (req, res) => {
    res.json({
        message: "Backend działa"
    })
})

app.use(errorHandler)

export default app