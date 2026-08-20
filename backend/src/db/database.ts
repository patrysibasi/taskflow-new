import dotenv from "dotenv"
import path from "node:path"

dotenv.config({
    path: path.resolve(process.cwd(), "../.env")
})

import pg from "pg"

const { Pool } = pg

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})