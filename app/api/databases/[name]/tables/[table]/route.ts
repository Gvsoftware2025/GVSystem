import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string; table: string }> }
) {
  const { name, table } = await params

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
    // Get columns info
    const colsResult = await dbPool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [table])

    // Get total count
    const countResult = await dbPool.query(`SELECT COUNT(*)::int as total FROM "${table}"`)
    const totalRows = countResult.rows[0]?.total || 0

    // Get rows (limit 500)
    const dataResult = await dbPool.query(`SELECT * FROM "${table}" ORDER BY id ASC LIMIT 500`)

    return NextResponse.json({
      table,
      columns: colsResult.rows,
      rows: dataResult.rows,
      fields: dataResult.fields?.map((f) => f.name) || [],
      totalRows,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await dbPool.end()
  }
}
