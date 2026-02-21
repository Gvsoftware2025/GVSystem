-- Criar tabela about_info
CREATE TABLE IF NOT EXISTS public.about_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  total_projects INTEGER DEFAULT 0,
  total_clients INTEGER DEFAULT 0,
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir dados iniciais
INSERT INTO public.about_info (title, description, total_projects, total_clients, years_experience)
VALUES (
  'GV Software',
  'Desenvolvimento de soluções digitais inovadoras',
  0,
  0,
  0
);

-- Habilitar Row Level Security
ALTER TABLE public.about_info ENABLE ROW LEVEL SECURITY;

-- Criar política para leitura pública
CREATE POLICY "Allow public read access"
  ON public.about_info
  FOR SELECT
  USING (true);

-- Criar política para atualização apenas do dono/admin
CREATE POLICY "Allow admin update"
  ON public.about_info
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
