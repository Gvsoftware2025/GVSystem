# Como Conectar o Site Público ao Painel Admin

## Problema
O site público (www.gvsoftware.tech) está mostrando dados hardcoded (50+, 100%, 5+) enquanto o painel admin salva dados diferentes no banco de dados.

## Solução
Criei APIs públicas que o site pode consumir sem autenticação.

## APIs Disponíveis

### 1. Informações "Sobre"
**Endpoint:** `GET /api/public/about`

**Resposta:**
```json
{
  "title": "Sobre a GV Software",
  "description": "Somos uma empresa especializada...",
  "projects_count": 5,
  "clients_count": 5,
  "years_experience": 1
}
```

### 2. Projetos
**Endpoint:** `GET /api/public/projects`

**Resposta:** Array de projetos

### 3. Habilidades
**Endpoint:** `GET /api/public/skills`

**Resposta:** Array de habilidades

## Como Usar no Site Público

No seu site www.gvsoftware.tech, substitua os valores hardcoded por um fetch:

```javascript
// Exemplo: Buscar dados do "Sobre"
async function loadAboutData() {
  try {
    const response = await fetch('https://SEU_PAINEL_ADMIN.vercel.app/api/public/about')
    const data = await response.json()
    
    // Atualizar o DOM com os dados
    document.querySelector('.projetos').textContent = `${data.projects_count}+`
    document.querySelector('.clientes').textContent = `${data.clients_count}+`
    document.querySelector('.anos').textContent = `${data.years_experience}+`
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
}

// Chamar quando a página carregar
loadAboutData()
```

## Importante
- Substitua `SEU_PAINEL_ADMIN.vercel.app` pela URL real onde este painel está hospedado
- As APIs têm CORS habilitado para funcionar de qualquer domínio
- Os dados são atualizados em tempo real do Supabase
