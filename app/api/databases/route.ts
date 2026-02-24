import { NextResponse } from "next/server"
import adminPool from "@/lib/admin-db"
import { Pool } from "pg"

export async function GET() {
  try {
    const result = await adminPool.query(`
      SELECT datname, pg_database_size(datname) as size
      FROM pg_database
      WHERE datistemplate = false
        AND datname NOT IN ('postgres', 'template0', 'template1')
      ORDER BY datname
    `)

    const databases = result.rows.map((row) => ({
      name: row.datname,
      size: formatBytes(parseInt(row.size)),
      sizeRaw: parseInt(row.size),
    }))

    return NextResponse.json(databases)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name || !/^[a-z][a-z0-9_]*$/.test(name)) {
      return NextResponse.json(
        { error: "Nome invalido. Use apenas letras minusculas, numeros e underscores. Deve comecar com letra." },
        { status: 400 }
      )
    }

    // Check if database already exists
    const exists = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [name]
    )
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: "Banco de dados ja existe" }, { status: 400 })
    }

    // Create database (can't use parameterized query for CREATE DATABASE)
    await adminPool.query(`CREATE DATABASE "${name}" OWNER postgres`)

    // Grant permissions to gvsoftware
    await adminPool.query(`GRANT ALL PRIVILEGES ON DATABASE "${name}" TO gvsoftware`)

    // Connect to the new database to create tables
    const newDbPool = new Pool({
      host: "217.216.91.111",
      port: 5432,
      database: name,
      user: "postgres",
      password: "gvsoftware1530",
      max: 2,
      ssl: false,
    })

    try {
      // Grant schema permissions
      await newDbPool.query(`GRANT ALL ON SCHEMA public TO gvsoftware`)
      await newDbPool.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO gvsoftware`)
      await newDbPool.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO gvsoftware`)

      // Create tables one by one (pg doesn't support multiple statements in one query)
      await newDbPool.query(`
        CREATE TABLE categorias (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          ordem INTEGER DEFAULT 0,
          ativo BOOLEAN DEFAULT true
        )
      `)

      await newDbPool.query(`
        CREATE TABLE produtos (
          id SERIAL PRIMARY KEY,
          categoria_id INTEGER REFERENCES categorias(id) ON DELETE CASCADE,
          nome VARCHAR(255) NOT NULL,
          descricao TEXT,
          preco DECIMAL(10,2) NOT NULL,
          imagem_url TEXT,
          disponivel BOOLEAN DEFAULT true,
          ordem INTEGER DEFAULT 0,
          criado_em TIMESTAMP DEFAULT NOW()
        )
      `)

      await newDbPool.query(`
        CREATE TABLE pedidos (
          id SERIAL PRIMARY KEY,
          mesa VARCHAR(20),
          cliente_nome VARCHAR(255),
          status VARCHAR(50) DEFAULT 'pendente',
          total DECIMAL(10,2),
          criado_em TIMESTAMP DEFAULT NOW()
        )
      `)

      await newDbPool.query(`
        CREATE TABLE itens_pedido (
          id SERIAL PRIMARY KEY,
          pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
          produto_id INTEGER REFERENCES produtos(id),
          quantidade INTEGER NOT NULL,
          preco_unitario DECIMAL(10,2) NOT NULL
        )
      `)

      await newDbPool.query(`GRANT ALL ON ALL TABLES IN SCHEMA public TO gvsoftware`)
      await newDbPool.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO gvsoftware`)
    } finally {
      await newDbPool.end()
    }

    return NextResponse.json({ success: true, name })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { name } = await request.json()

    if (!name || name === "gvsoftware" || name === "postgres") {
      return NextResponse.json({ error: "Nao e possivel excluir este banco" }, { status: 400 })
    }

    // Terminate all connections to the database
    await adminPool.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid()
    `, [name])

    // Drop database
    await adminPool.query(`DROP DATABASE IF EXISTS "${name}"`)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}
