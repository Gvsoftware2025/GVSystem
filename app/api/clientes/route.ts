import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM empresas ORDER BY criado_em DESC")
    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rows } = await pool.query(
      `INSERT INTO empresas (nome, subdominio, telefone, endereco, logo_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [body.nome, body.subdominio, body.telefone, body.endereco, body.logo_url]
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
      `UPDATE empresas SET nome=$1, subdominio=$2, telefone=$3, endereco=$4, logo_url=$5, ativo=$6 WHERE id=$7 RETURNING *`,
      [body.nome, body.subdominio, body.telefone, body.endereco, body.logo_url, body.ativo, body.id]
    )
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await pool.query("DELETE FROM empresas WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
