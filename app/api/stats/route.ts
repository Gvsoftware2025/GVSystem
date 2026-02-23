import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    // Debug: list all tables in the database
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name
    `)
    console.log("[v0] Tables in database:", tables.rows.map(r => r.table_name))

    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM portfolio_projects)::int AS projects,
        (SELECT COUNT(*) FROM portfolio_skills)::int AS skills,
        (SELECT COUNT(*) FROM portfolio_contacts)::int AS contacts,
        (SELECT COUNT(*) FROM portfolio_feedbacks)::int AS feedbacks
    `)
    console.log("[v0] Stats result:", result.rows[0])
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.log("[v0] Stats error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
