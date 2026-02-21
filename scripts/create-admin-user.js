const SUPABASE_URL = "https://qiaudcxrvithmixdbcqj.supabase.co"
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYXVkY3hydml0aG1peGRiY3FqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU0NzgzMiwiZXhwIjoyMDg3MTIzODMyfQ.wctyEkrSTrDw-co6r45Mey14YLio8xCzRUl645PHw-k"

async function createAdminUser() {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "apikey": SERVICE_ROLE_KEY
    },
    body: JSON.stringify({
      email: "contato.gvsoftwares@gmail.com",
      password: "admin123456",
      email_confirm: true
    })
  })

  const data = await response.json()

  if (response.ok) {
    console.log("Usuario criado com sucesso!")
    console.log("Email: contato.gvsoftwares@gmail.com")
    console.log("Senha: admin123456")
    console.log("ID:", data.id)
  } else {
    console.log("Erro:", JSON.stringify(data, null, 2))
  }
}

createAdminUser()
