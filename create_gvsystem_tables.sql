-- Script SQL para criar as tabelas do sistema GVSystem
-- Compatível com PostgreSQL (para uso em VPS)

-- Tabela para informações 'Sobre'
CREATE TABLE IF NOT EXISTS portfolio_about (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    projects_count INTEGER DEFAULT 0,
    clients_count INTEGER DEFAULT 0,
    years_experience INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais para 'Sobre' se a tabela estiver vazia
INSERT INTO portfolio_about (title, description, projects_count, clients_count, years_experience)
SELECT 'Sobre a GV Software', 'Somos uma empresa especializada em desenvolvimento de software, com foco em soluções inovadoras e personalizadas para nossos clientes.', 5, 100, 1
WHERE NOT EXISTS (SELECT 1 FROM portfolio_about);

-- Tabela para Projetos
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    github_url TEXT,
    technologies TEXT[], -- Array de strings para tecnologias
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Habilidades
CREATE TABLE IF NOT EXISTS portfolio_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT, -- Caminho ou nome do ícone
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Contatos
CREATE TABLE IF NOT EXISTS portfolio_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Feedbacks
CREATE TABLE IF NOT EXISTS portfolio_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Avaliação de 1 a 5
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para Usuários (para autenticação, similar ao Supabase Auth)
-- Esta é uma simplificação. Um sistema de autenticação completo exigiria mais campos e lógica.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Armazenar hashes de senha, nunca senhas em texto claro
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_portfolio_about_created_at ON portfolio_about (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_display_order ON portfolio_projects (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_portfolio_skills_name ON portfolio_skills (name);
CREATE INDEX IF NOT EXISTS idx_portfolio_contacts_created_at ON portfolio_contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_feedbacks_created_at ON portfolio_feedbacks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
