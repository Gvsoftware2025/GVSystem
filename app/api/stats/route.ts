import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM portfolio_projects)::int AS projects,
        (SELECT COUNT(*) FROM portfolio_skills)::int AS skills,
        (SELECT COUNT(*) FROM portfolio_contacts)::int AS contacts,
        (SELECT COUNT(*) FROM portfolio_feedbacks)::int AS feedbacks
    `)
    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
