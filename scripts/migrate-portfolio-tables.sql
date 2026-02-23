-- =============================================
-- GV Software - Todas as tabelas
-- Rodar na VPS: psql -h 217.216.91.111 -U gvsoftware -d gvsoftware -f migrate-portfolio-tables.sql
-- =============================================

-- 1. Projetos do Portfolio
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilidades/Skills
CREATE TABLE IF NOT EXISTS portfolio_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'frontend',
  icon TEXT,
  color TEXT DEFAULT '#7c3aed',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sobre (About)
CREATE TABLE IF NOT EXISTS portfolio_about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  projects_count INT DEFAULT 0,
  clients_count INT DEFAULT 0,
  years_experience INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Contatos/Mensagens
CREATE TABLE IF NOT EXISTS portfolio_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  phone TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Feedbacks/Depoimentos
CREATE TABLE IF NOT EXISTS portfolio_feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  avaliacao INT DEFAULT 5,
  comentario TEXT,
  visivel BOOLEAN DEFAULT false,
  data TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Clientes (empresas)
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  telefone TEXT,
  endereco TEXT,
  cor_primaria TEXT DEFAULT '#7c3aed',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Categorias do cardapio
CREATE TABLE IF NOT EXISTS cardapio_categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Produtos do cardapio
CREATE TABLE IF NOT EXISTS cardapio_produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES cardapio_categorias(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  imagem_url TEXT,
  disponivel BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default about row if empty
INSERT INTO portfolio_about (title, description, projects_count, clients_count, years_experience)
SELECT 'Sobre a GV Software', 'Somos uma empresa especializada em desenvolvimento de software.', 50, 30, 5
WHERE NOT EXISTS (SELECT 1 FROM portfolio_about);
