import pg from "pg";

const pool = new pg.Pool({
  host: "217.216.91.111",
  port: 5432,
  database: "gvsoftware",
  user: "gvsoftware",
  password: "gvsoftware1530",
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log("[v0] Criando tabelas de cardapio...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        logo_url TEXT,
        telefone TEXT,
        endereco TEXT,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS cardapio_categorias (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
        nome TEXT NOT NULL,
        ordem INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS cardapio_produtos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        categoria_id UUID REFERENCES cardapio_categorias(id) ON DELETE CASCADE,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL DEFAULT 0,
        imagem_url TEXT,
        disponivel BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log("[v0] Tabelas criadas com sucesso");

    // Inserir clientes
    const c1 = await client.query(`
      INSERT INTO clientes (nome, slug, telefone, endereco)
      VALUES ('Restaurante Sabor da Terra', 'sabor-da-terra', '(11) 99999-1234', 'Rua das Flores, 123 - Centro')
      RETURNING id
    `);
    const c2 = await client.query(`
      INSERT INTO clientes (nome, slug, telefone, endereco)
      VALUES ('Pizzaria Bella Napoli', 'bella-napoli', '(11) 98888-5678', 'Av. Italia, 456 - Jardins')
      RETURNING id
    `);
    console.log("[v0] 2 clientes inseridos");

    const clienteId1 = c1.rows[0].id;
    const clienteId2 = c2.rows[0].id;

    // Categorias cliente 1
    const cat1 = await client.query(`INSERT INTO cardapio_categorias (cliente_id, nome, ordem) VALUES ($1, 'Pratos Executivos', 1) RETURNING id`, [clienteId1]);
    const cat2 = await client.query(`INSERT INTO cardapio_categorias (cliente_id, nome, ordem) VALUES ($1, 'Bebidas', 2) RETURNING id`, [clienteId1]);
    const cat3 = await client.query(`INSERT INTO cardapio_categorias (cliente_id, nome, ordem) VALUES ($1, 'Sobremesas', 3) RETURNING id`, [clienteId1]);

    // Categorias cliente 2
    const cat4 = await client.query(`INSERT INTO cardapio_categorias (cliente_id, nome, ordem) VALUES ($1, 'Pizzas Tradicionais', 1) RETURNING id`, [clienteId2]);
    const cat5 = await client.query(`INSERT INTO cardapio_categorias (cliente_id, nome, ordem) VALUES ($1, 'Pizzas Especiais', 2) RETURNING id`, [clienteId2]);
    const cat6 = await client.query(`INSERT INTO cardapio_categorias (cliente_id, nome, ordem) VALUES ($1, 'Bebidas', 3) RETURNING id`, [clienteId2]);
    console.log("[v0] 6 categorias inseridas");

    // Produtos cliente 1
    await client.query(`INSERT INTO cardapio_produtos (categoria_id, nome, descricao, preco) VALUES
      ($1, 'Filé Grelhado', 'Filé mignon grelhado com arroz, feijão e salada', 32.90),
      ($1, 'Frango à Parmegiana', 'Peito de frango empanado com molho e queijo', 28.90),
      ($1, 'Salmão ao Molho de Maracujá', 'Salmão grelhado com molho especial', 45.90)
    `, [cat1.rows[0].id]);

    await client.query(`INSERT INTO cardapio_produtos (categoria_id, nome, descricao, preco) VALUES
      ($1, 'Suco Natural', 'Laranja, limão, maracujá ou abacaxi', 8.90),
      ($1, 'Refrigerante Lata', 'Coca-Cola, Guaraná ou Fanta', 6.90),
      ($1, 'Água Mineral', 'Com ou sem gás 500ml', 4.90)
    `, [cat2.rows[0].id]);

    await client.query(`INSERT INTO cardapio_produtos (categoria_id, nome, descricao, preco) VALUES
      ($1, 'Pudim de Leite', 'Pudim cremoso com calda de caramelo', 12.90),
      ($1, 'Brownie com Sorvete', 'Brownie de chocolate com sorvete de creme', 16.90)
    `, [cat3.rows[0].id]);

    // Produtos cliente 2
    await client.query(`INSERT INTO cardapio_produtos (categoria_id, nome, descricao, preco) VALUES
      ($1, 'Margherita', 'Molho de tomate, mussarela e manjericão', 39.90),
      ($1, 'Calabresa', 'Calabresa fatiada, cebola e azeitonas', 42.90),
      ($1, 'Portuguesa', 'Presunto, ovo, cebola, azeitona e ervilha', 44.90)
    `, [cat4.rows[0].id]);

    await client.query(`INSERT INTO cardapio_produtos (categoria_id, nome, descricao, preco) VALUES
      ($1, 'Quatro Queijos', 'Mussarela, provolone, gorgonzola e parmesão', 49.90),
      ($1, 'Frango com Catupiry', 'Frango desfiado com catupiry original', 47.90),
      ($1, 'Lombo Canadense', 'Lombo, catupiry, cebola caramelizada', 52.90)
    `, [cat5.rows[0].id]);

    await client.query(`INSERT INTO cardapio_produtos (categoria_id, nome, descricao, preco) VALUES
      ($1, 'Cerveja Artesanal', 'IPA, Pilsen ou Weiss 500ml', 18.90),
      ($1, 'Refrigerante 2L', 'Coca-Cola, Guaraná ou Sprite', 12.90)
    `, [cat6.rows[0].id]);

    console.log("[v0] 17 produtos inseridos");
    console.log("[v0] Seed de cardapio concluido com sucesso!");
  } catch (err) {
    console.log("[v0] ERRO:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
