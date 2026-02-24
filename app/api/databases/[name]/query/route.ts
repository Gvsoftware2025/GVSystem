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

    // Split SQL into individual statements and execute each one
    // This handles multiple CREATE TABLE, INSERT, etc. in one submission
    const statements = sql
      .split(/;/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0 && !s.startsWith("--"))

    await client.query("BEGIN")

    let lastResult: any = { rows: [], rowCount: 0, fields: [], command: "" }
    let totalRowCount = 0
    const commands: string[] = []

    for (const statement of statements) {
      const result = await client.query(statement)
      lastResult = result
      totalRowCount += result.rowCount ?? 0
      if (result.command) commands.push(result.command)
    }

    await client.query("COMMIT")

    const duration = Date.now() - startTime
    const uniqueCommands = [...new Set(commands)]

    // Build message based on what was executed
    let message = ""
    if (uniqueCommands.includes("CREATE")) message += "Tabela(s) criada(s). "
    if (uniqueCommands.includes("INSERT")) message += `${totalRowCount} registro(s) inserido(s). `
    if (uniqueCommands.includes("UPDATE")) message += `${totalRowCount} registro(s) atualizado(s). `
    if (uniqueCommands.includes("DELETE")) message += `${totalRowCount} registro(s) removido(s). `
    if (uniqueCommands.includes("DROP")) message += "Removido com sucesso. "
    if (uniqueCommands.includes("ALTER")) message += "Tabela alterada. "
    if (uniqueCommands.includes("GRANT")) message += "Permissoes concedidas. "
    if (!message) message = `${statements.length} comando(s) executado(s).`

    return NextResponse.json({
      rows: lastResult.rows || [],
      rowCount: totalRowCount,
      fields: lastResult.fields?.map((f: any) => f.name) || [],
      command: uniqueCommands.join(", "),
      duration,
      message: message.trim(),
      statementsExecuted: statements.length,
    })
  } catch (error: any) {
    await client.query("ROLLBACK").catch(() => {})
    return NextResponse.json({ error: error.message }, { status: 400 })
  } finally {
    client.release()
    await dbPool.end()
  }
}
