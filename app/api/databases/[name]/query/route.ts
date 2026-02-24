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

  const client = await dbPool.connect()

  try {
    const startTime = Date.now()

    // Execute the entire SQL block as a single transaction
    // This supports multiple statements separated by ;
    await client.query("BEGIN")
    const result = await client.query(sql)
    await client.query("COMMIT")

    const duration = Date.now() - startTime

    return NextResponse.json({
      rows: result.rows || [],
      rowCount: result.rowCount ?? 0,
      fields: result.fields?.map((f: any) => f.name) || [],
      command: result.command || "",
      duration,
      message: result.command === "CREATE" ? "Tabela criada com sucesso" :
               result.command === "INSERT" ? `${result.rowCount} registro(s) inserido(s)` :
               result.command === "UPDATE" ? `${result.rowCount} registro(s) atualizado(s)` :
               result.command === "DELETE" ? `${result.rowCount} registro(s) removido(s)` :
               result.command === "DROP" ? "Removido com sucesso" :
               result.command === "ALTER" ? "Tabela alterada com sucesso" :
               undefined,
    })
  } catch (error: any) {
    await client.query("ROLLBACK").catch(() => {})
    return NextResponse.json({ error: error.message }, { status: 400 })
  } finally {
    client.release()
    await dbPool.end()
  }
}
