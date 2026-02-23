import { Pool } from "pg"

const pool = new Pool({
  host: "217.216.91.111",
  port: 5432,
  database: "gvsoftware",
  user: "gvsoftware",
  password: "gvsoftware1530",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: false,
})

export default pool
