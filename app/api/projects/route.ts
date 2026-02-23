import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM portfolio_projects ORDER BY display_order ASC, created_at DESC"
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
      `INSERT INTO portfolio_projects (title, description, image_url, project_url, github_url, technologies, is_featured, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [body.title, body.description, body.image_url, body.project_url, body.github_url, body.technologies, body.is_featured, body.display_order]
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
      `UPDATE portfolio_projects
       SET title=$1, description=$2, image_url=$3, project_url=$4, github_url=$5, technologies=$6, is_featured=$7, display_order=$8
       WHERE id=$9
       RETURNING *`,
      [body.title, body.description, body.image_url, body.project_url, body.github_url, body.technologies, body.is_featured, body.display_order, body.id]
    )
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await pool.query("DELETE FROM portfolio_projects WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
