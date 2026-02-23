import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { rows } = await pool.query(
      `SELECT p.*, c.nome as categoria_nome
       FROM produtos p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.empresa_id = $1
       ORDER BY p.ordem ASC`, [id]
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
      `INSERT INTO produtos (empresa_id, categoria_id, nome, descricao, preco, imagem_url, disponivel, ordem)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, body.categoria_id, body.nome, body.descricao, body.preco, body.imagem_url, body.disponivel ?? true, body.ordem || 0]
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
      `UPDATE produtos SET categoria_id=$1, nome=$2, descricao=$3, preco=$4, imagem_url=$5, disponivel=$6, ordem=$7
       WHERE id=$8 RETURNING *`,
      [body.categoria_id, body.nome, body.descricao, body.preco, body.imagem_url, body.disponivel, body.ordem, body.id]
    )
    return NextResponse.json(rows[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await pool.query("DELETE FROM produtos WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
