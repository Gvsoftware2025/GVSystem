import pg from "pg"
const { Pool } = pg

const pool = new Pool({
  host: "217.216.91.111",
  port: 5432,
  database: "cardapio_pizzaria",
  user: "postgres",
  password: "gvsoftware1530",
  ssl: false,
})

async function fix() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        ordem INTEGER DEFAULT 0,
        ativo BOOLEAN DEFAULT true
      )
    `)
    console.log("[v0] Tabela categorias criada")

    await client.query(`
      CREATE TABLE IF NOT EXISTS produtos (
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
    console.log("[v0] Tabela produtos criada")

    await client.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        mesa VARCHAR(20),
        cliente_nome VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pendente',
        total DECIMAL(10,2),
        criado_em TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log("[v0] Tabela pedidos criada")

    await client.query(`
      CREATE TABLE IF NOT EXISTS itens_pedido (
        id SERIAL PRIMARY KEY,
        pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
        produto_id INTEGER REFERENCES produtos(id),
        quantidade INTEGER NOT NULL,
        preco_unitario DECIMAL(10,2) NOT NULL
      )
    `)
    console.log("[v0] Tabela itens_pedido criada")

    await client.query(`GRANT ALL ON ALL TABLES IN SCHEMA public TO gvsoftware`)
    await client.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO gvsoftware`)
    console.log("[v0] Permissoes concedidas")

    console.log("[v0] SUCESSO - Todas as tabelas criadas em cardapio_pizzaria!")
  } catch (err) {
    console.error("[v0] Erro:", err.message)
  } finally {
    client.release()
    await pool.end()
  }
}

fix()
