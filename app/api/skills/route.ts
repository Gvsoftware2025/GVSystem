import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM portfolio_skills ORDER BY category, display_order ASC"
    )
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rows } = await pool.query(
      `INSERT INTO portfolio_skills (name, category, icon, color, display_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [body.name, body.category, body.icon, body.color, body.display_order]
    )
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { rows } = await pool.query(
      `UPDATE portfolio_skills SET name=$1, category=$2, icon=$3, color=$4 WHERE id=$5 RETURNING *`,
      [body.name, body.category, body.icon, body.color, body.id]
    )
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await pool.query("DELETE FROM portfolio_skills WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
