import { Pool } from "pg"

const adminPool = new Pool({
  host: "217.216.91.111",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "gvsoftware1530",
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: false,
})

export default adminPool
