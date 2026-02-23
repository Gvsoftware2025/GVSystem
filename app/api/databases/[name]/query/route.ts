import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const { sql } = await request.json()

  if (!sql || !sql.trim()) {
    return NextResponse.json({ error: "SQL vazio" }, { status: 400 })
  }

  const dbPool = new Pool({
    host: "217.216.91.111",
    port: 5432,
    database: name,
    user: "postgres",
    password: "gvsoftware1530",
    max: 2,
    ssl: false,
  })

  try {
    const startTime = Date.now()
    const result = await dbPool.query(sql)
    const duration = Date.now() - startTime

    return NextResponse.json({
      rows: result.rows || [],
      rowCount: result.rowCount ?? 0,
      fields: result.fields?.map((f) => f.name) || [],
      command: result.command || "",
      duration,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  } finally {
    await dbPool.end()
  }
}
