import { NextResponse } from "next/server"
import { Pool } from "pg"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params

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
    // Get all tables
    const tablesResult = await dbPool.query(`
      SELECT
        t.table_name,
        pg_total_relation_size(quote_ident(t.table_name)) as size,
        (SELECT count(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') as columns
      FROM information_schema.tables t
      WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name
    `)

    const tables = []
    for (const row of tablesResult.rows) {
      const countResult = await dbPool.query(`SELECT COUNT(*)::int as count FROM "${row.table_name}"`)
      tables.push({
        name: row.table_name,
        columns: parseInt(row.columns),
        rows: countResult.rows[0].count,
        size: formatBytes(parseInt(row.size)),
      })
    }

    return NextResponse.json({ database: name, tables })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await dbPool.end()
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}
