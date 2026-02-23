import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: "217.216.91.111",
  port: 5432,
  database: "gvsoftware",
  user: "gvsoftware",
  password: "gvsoftware1530",
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO portfolio_about (title, description, projects_count, clients_count, years_experience)
      VALUES (
        'Sobre a GV Software',
        'Somos uma empresa especializada em desenvolvimento de software, focada em criar soluções digitais inovadoras que impulsionam o crescimento do seu negócio. Com expertise em tecnologias modernas e foco na experiência do usuário, transformamos ideias em realidade digital.',
        50,
        30,
        5
      )
    `);
    console.log("[v0] About inserido com sucesso");
  } catch (err) {
    console.error("[v0] Erro:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
