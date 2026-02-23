import { Pool } from "pg"

const pool = new Pool({
  host: process.env.DB_HOST || "217.216.91.111",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "gvsoftware",
  user: process.env.DB_USER || "gvsoftware",
  password: process.env.DB_PASSWORD || "gvsoftware1530",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: false,
})

export default pool
