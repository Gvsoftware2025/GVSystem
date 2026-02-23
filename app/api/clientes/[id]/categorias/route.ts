import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { rows } = await pool.query(
      "SELECT * FROM categorias WHERE empresa_id = $1 ORDER BY ordem ASC", [id]
    )
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { rows } = await pool.query(
      "INSERT INTO categorias (empresa_id, nome, ordem) VALUES ($1, $2, $3) RETURNING *",
      [id, body.nome, body.ordem || 0]
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
      "UPDATE categorias SET nome=$1, ordem=$2, ativo=$3 WHERE id=$4 RETURNING *",
      [body.nome, body.ordem, body.ativo, body.id]
    )
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await pool.query("DELETE FROM categorias WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
