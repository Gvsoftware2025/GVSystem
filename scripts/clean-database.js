import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: "217.216.91.111",
  port: 5432,
  database: "gvsoftware",
  user: "gvsoftware",
  password: "gvsoftware1530",
});

async function clean() {
  const client = await pool.connect();
  try {
    // Limpar tudo EXCETO portfolio_skills
    await client.query("DELETE FROM cardapio_produtos");
    console.log("cardapio_produtos limpa");

    await client.query("DELETE FROM cardapio_categorias");
    console.log("cardapio_categorias limpa");

    await client.query("DELETE FROM clientes");
    console.log("clientes limpa");

    await client.query("DELETE FROM portfolio_feedbacks");
    console.log("portfolio_feedbacks limpa");

    await client.query("DELETE FROM portfolio_contacts");
    console.log("portfolio_contacts limpa");

    await client.query("DELETE FROM portfolio_projects");
    console.log("portfolio_projects limpa");

    await client.query("DELETE FROM portfolio_about");
    console.log("portfolio_about limpa");

    // Verificar skills mantidas
    const skills = await client.query("SELECT COUNT(*) FROM portfolio_skills");
    console.log("portfolio_skills mantida com", skills.rows[0].count, "registros");

    console.log("Limpeza concluida! Apenas habilidades foram mantidas.");
  } catch (err) {
    console.error("Erro:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

clean();
