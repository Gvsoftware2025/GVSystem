import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: "217.216.91.111",
  port: 5432,
  database: "gvsoftware",
  user: "gvsoftware",
  password: "gvsoftware1530",
  ssl: false,
  connectionTimeoutMillis: 15000,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log("[v0] Conectado ao banco. Inserindo dados...");

    // 1. Portfolio About
    await client.query(`DELETE FROM portfolio_about`);
    await client.query(`
      INSERT INTO portfolio_about (title, description, projects_count, clients_count, years_experience)
      VALUES ('Sobre a GV Software', 'Somos uma empresa especializada em desenvolvimento de software, focada em criar solucoes digitais inovadoras que impulsionam o crescimento do seu negocio. Com expertise em tecnologias modernas e foco na experiencia do usuario, transformamos ideias em realidade digital.', 50, 30, 5)
    `);
    console.log("[v0] portfolio_about inserido");

    // 2. Portfolio Projects
    await client.query(`DELETE FROM portfolio_projects`);
    await client.query(`
      INSERT INTO portfolio_projects (title, description, image_url, project_url, technologies, is_featured, display_order) VALUES
      ('E-commerce Premium', 'Plataforma de e-commerce completa com painel admin, carrinho de compras, pagamentos via Stripe e painel de analytics.', '', 'https://exemplo.com', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'], true, 1),
      ('App de Delivery', 'Aplicativo de delivery com rastreamento em tempo real, chat integrado e sistema de avaliacoes.', '', 'https://exemplo.com', ARRAY['React Native', 'Node.js', 'Socket.io', 'MongoDB'], true, 2),
      ('Dashboard Financeiro', 'Painel financeiro com graficos interativos, relatorios automatizados e integracao bancaria.', '', 'https://exemplo.com', ARRAY['React', 'D3.js', 'Python', 'PostgreSQL'], true, 3),
      ('Sistema de Agendamento', 'Sistema completo de agendamento online para clinicas e consultorios com notificacoes automaticas.', '', 'https://exemplo.com', ARRAY['Next.js', 'Prisma', 'PostgreSQL', 'Twilio'], false, 4),
      ('Rede Social Corporativa', 'Plataforma de comunicacao interna para empresas com feed, chat e gerenciamento de equipes.', '', 'https://exemplo.com', ARRAY['React', 'GraphQL', 'AWS', 'Redis'], false, 5),
      ('Landing Page Moderna', 'Landing page responsiva com animacoes avancadas, otimizada para SEO e conversao.', '', 'https://exemplo.com', ARRAY['Next.js', 'Framer Motion', 'Tailwind CSS'], false, 6)
    `);
    console.log("[v0] portfolio_projects inseridos: 6 projetos");

    // 3. Portfolio Skills
    await client.query(`DELETE FROM portfolio_skills`);
    await client.query(`
      INSERT INTO portfolio_skills (name, category, icon, color, display_order) VALUES
      ('React', 'frontend', 'react', '#61DAFB', 1),
      ('Next.js', 'frontend', 'nextjs', '#000000', 2),
      ('TypeScript', 'frontend', 'typescript', '#3178C6', 3),
      ('Tailwind CSS', 'frontend', 'tailwind', '#06B6D4', 4),
      ('JavaScript', 'frontend', 'javascript', '#F7DF1E', 5),
      ('HTML5', 'frontend', 'html5', '#E34F26', 6),
      ('CSS3', 'frontend', 'css3', '#1572B6', 7),
      ('Node.js', 'backend', 'nodejs', '#339933', 8),
      ('Python', 'backend', 'python', '#3776AB', 9),
      ('PostgreSQL', 'backend', 'postgresql', '#4169E1', 10),
      ('MongoDB', 'backend', 'mongodb', '#47A248', 11),
      ('Docker', 'devops', 'docker', '#2496ED', 12),
      ('Git', 'devops', 'git', '#F05032', 13),
      ('AWS', 'devops', 'aws', '#FF9900', 14),
      ('Linux', 'devops', 'linux', '#FCC624', 15),
      ('Figma', 'design', 'figma', '#F24E1E', 16)
    `);
    console.log("[v0] portfolio_skills inseridos: 16 habilidades");

    // 4. Portfolio Contacts
    await client.query(`DELETE FROM portfolio_contacts`);
    await client.query(`
      INSERT INTO portfolio_contacts (name, email, company, phone, message, is_read, created_at) VALUES
      ('Carlos Oliveira', 'carlos@empresa.com.br', 'Oliveira Tech', '(11) 99999-1234', 'Ola! Preciso de um sistema de gestao para minha empresa. Podem me enviar um orcamento?', false, NOW() - INTERVAL '2 hours'),
      ('Ana Maria Santos', 'ana.santos@gmail.com', 'Loja da Ana', '(21) 98888-5678', 'Gostaria de criar um e-commerce para minha loja de roupas. Qual o prazo medio de entrega?', false, NOW() - INTERVAL '5 hours'),
      ('Roberto Silva', 'roberto@construtora.com', 'Silva Construtora', '(31) 97777-9012', 'Estamos precisando de um app mobile para nossos clientes acompanharem as obras. Podemos agendar uma reuniao?', true, NOW() - INTERVAL '1 day'),
      ('Fernanda Costa', 'fernanda@startup.io', 'StartUp Now', '(41) 96666-3456', 'Vi o portfolio de voces e adorei! Estamos lancando uma startup e precisamos de um MVP. Vamos conversar?', false, NOW() - INTERVAL '2 days'),
      ('Marcos Pereira', 'marcos@clinica.med.br', 'Clinica Saude+', '(51) 95555-7890', 'Preciso de um sistema de agendamento online para minha clinica. Voces fazem isso?', true, NOW() - INTERVAL '3 days')
    `);
    console.log("[v0] portfolio_contacts inseridos: 5 mensagens");

    // 5. Portfolio Feedbacks
    await client.query(`DELETE FROM portfolio_feedbacks`);
    await client.query(`
      INSERT INTO portfolio_feedbacks (nome, avaliacao, comentario, visivel, data) VALUES
      ('Joao Pedro Almeida', 5, 'Excelente trabalho! A GV Software entregou o projeto no prazo e com qualidade impecavel. Recomendo demais!', true, NOW() - INTERVAL '5 days'),
      ('Maria Clara Ribeiro', 5, 'Profissionais incriveis! Transformaram nossa ideia em um produto incrivel. O suporte pos-entrega tambem e otimo.', true, NOW() - INTERVAL '10 days'),
      ('Lucas Mendes', 4, 'Muito bom o servico! O sistema ficou exatamente como eu queria. Apenas sugiro mais opcoes de personalizacao.', true, NOW() - INTERVAL '15 days'),
      ('Patricia Ferreira', 5, 'A melhor experiencia que ja tive com desenvolvimento de software. Comunicacao clara e resultado excepcional!', true, NOW() - INTERVAL '20 days'),
      ('Rafael Goncalves', 5, 'Contratei para fazer meu e-commerce e estou muito satisfeito. Vendas aumentaram 40% apos o lancamento!', false, NOW() - INTERVAL '25 days'),
      ('Camila Torres', 4, 'Otima equipe tecnica. Entenderam perfeitamente nossas necessidades e entregaram uma solucao robusta.', false, NOW() - INTERVAL '30 days')
    `);
    console.log("[v0] portfolio_feedbacks inseridos: 6 feedbacks");

    // 6. Clientes (cardapio digital)
    await client.query(`DELETE FROM cardapio_produtos`);
    await client.query(`DELETE FROM cardapio_categorias`);
    await client.query(`DELETE FROM clientes`);
    await client.query(`
      INSERT INTO clientes (id, nome, slug, telefone, endereco, cor_primaria, ativo) VALUES
      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Restaurante Sabor Mineiro', 'sabor-mineiro', '(11) 3333-4444', 'Rua das Flores, 123 - Sao Paulo/SP', '#e74c3c', true),
      ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Pizzaria Bella Italia', 'bella-italia', '(21) 5555-6666', 'Av. Paulista, 456 - Rio de Janeiro/RJ', '#f39c12', true)
    `);
    console.log("[v0] clientes inseridos: 2 clientes");

    // 7. Categorias
    await client.query(`
      INSERT INTO cardapio_categorias (id, cliente_id, nome, display_order) VALUES
      ('c1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pratos Principais', 1),
      ('c2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bebidas', 2),
      ('c3333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sobremesas', 3),
      ('c4444444-4444-4444-4444-444444444444', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Pizzas Tradicionais', 1),
      ('c5555555-5555-5555-5555-555555555555', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Pizzas Especiais', 2),
      ('c6666666-6666-6666-6666-666666666666', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Bebidas', 3)
    `);
    console.log("[v0] cardapio_categorias inseridas: 6 categorias");

    // 8. Produtos
    await client.query(`
      INSERT INTO cardapio_produtos (cliente_id, categoria_id, nome, descricao, preco, disponivel, display_order) VALUES
      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c1111111-1111-1111-1111-111111111111', 'Frango com Quiabo', 'Frango caipira com quiabo e angu', 42.90, true, 1),
      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c1111111-1111-1111-1111-111111111111', 'Feijao Tropeiro', 'Feijao tropeiro completo com linguica, torresmo e couve', 38.50, true, 2),
      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c1111111-1111-1111-1111-111111111111', 'Picanha na Chapa', 'Picanha grelhada com arroz, feijao e vinagrete', 59.90, true, 3),
      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c2222222-2222-2222-2222-222222222222', 'Suco Natural', 'Suco de laranja, limao ou maracuja', 9.90, true, 1),
      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c2222222-2222-2222-2222-222222222222', 'Refrigerante Lata', 'Coca-Cola, Guarana ou Sprite', 7.50, true, 2),
      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c3333333-3333-3333-3333-333333333333', 'Doce de Leite', 'Doce de leite caseiro com queijo minas', 15.90, true, 1),
      ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c3333333-3333-3333-3333-333333333333', 'Pudim', 'Pudim de leite condensado', 12.90, true, 2),
      ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c4444444-4444-4444-4444-444444444444', 'Pizza Margherita', 'Molho de tomate, mussarela, manjericao fresco', 45.90, true, 1),
      ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c4444444-4444-4444-4444-444444444444', 'Pizza Calabresa', 'Calabresa fatiada, cebola e azeitonas', 42.90, true, 2),
      ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c4444444-4444-4444-4444-444444444444', 'Pizza Portuguesa', 'Presunto, ovos, cebola, azeitonas e pimentao', 48.90, true, 3),
      ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c5555555-5555-5555-5555-555555555555', 'Pizza Quatro Queijos', 'Mussarela, gorgonzola, parmesao e provolone', 54.90, true, 1),
      ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c5555555-5555-5555-5555-555555555555', 'Pizza Frango Catupiry', 'Frango desfiado com catupiry e milho', 49.90, true, 2),
      ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c6666666-6666-6666-6666-666666666666', 'Guarana Antarctica 2L', 'Guarana Antarctica garrafa 2 litros', 12.90, true, 1),
      ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c6666666-6666-6666-6666-666666666666', 'Coca-Cola 2L', 'Coca-Cola garrafa 2 litros', 14.90, true, 2)
    `);
    console.log("[v0] cardapio_produtos inseridos: 14 produtos");

    console.log("[v0] SEED COMPLETO! Todas as tabelas foram populadas.");

  } catch (err) {
    console.error("[v0] ERRO no seed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
