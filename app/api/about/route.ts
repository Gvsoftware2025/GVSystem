import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM portfolio_about ORDER BY created_at DESC LIMIT 1"
    )
    return NextResponse.json(rows[0] || {})
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { rows } = await pool.query(
      `UPDATE portfolio_about
       SET title = $1, description = $2, projects_count = $3, clients_count = $4, years_experience = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [body.title, body.description, body.projects_count, body.clients_count, body.years_experience, body.id]
    )
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
