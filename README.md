# js-with-docker-compose

Documentação das rotas e exemplos de request/response para o desenvolvedor frontend.

Base URL local: http://localhost:3000

Autenticação

- Todas as rotas que requerem autenticação devem receber o header:
  token: <token>
- O valor do token é o campo `token` retornado nas respostas de login, cadastro ou /api/user/me — envie esse valor diretamente no header `token`.
- Exemplo de header:
  - token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Formato de erro padrão
Status: 4xx / 5xx
{
"error": "mensagem descritiva",
"code": "ERROR*CODE_OPTIONAL",
"details": { /* campos opcionais \_/ }
}

Rotas

1. POST /api/user/cadastro
   Descrição: Criar novo usuário.
   Request:

- curl:
  curl -X POST http://localhost:3000/api/user/cadastro -H "Content-Type: application/json" -d '{"name":"Nome","email":"user@example.com","password":"senha"}'

Request body (JSON):
{
"name": "Nome", // string, obrigatório
"email": "user@example.com", // string, obrigatório, formato email
"password": "senha" // string, obrigatório, mínimo 6 caracteres recomendado
}

Responses:

- 201 Created
  {
  "id": "new-user-id",
  "name": "Nome",
  "email": "user@example.com"
  }
- 400 Bad Request (ex: email já cadastrado / validação)
  {
  "error": "Email já cadastrado"
  }

UI hints:

- Mostrar validação inline (email válido, password mínimo).
- Após cadastro bem-sucedido, navegar para tela de login.

---

2. POST /api/user/login
   Descrição: Autenticar usuário e retornar token JWT.
   Request:

- curl:
  curl -X POST http://localhost:3000/api/user/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"senha"}'

Request body:
{
"email": "user@example.com",
"password": "senha"
}

Responses:

- 200 OK
  {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
  "id": "user-id",
  "email": "user@example.com",
  "name": "Nome do Usuário"
  }
  }
- 401 Unauthorized
  {
  "error": "Credenciais inválidas"
  }

UI hints:

- Armazenar token e usuário no estado global / localStorage.
- Redirecionar para dashboard após login.

---

3. GET /api/user/me
   Descrição: Retorna os dados do usuário autenticado.
   Request:

- curl:
  curl -H "token: <token>" http://localhost:3000/api/user/me

Responses:

- 200 OK
  {
  "success": true,
  "user": {
  "id": "user-id",
  "email": "user@example.com",
  "name": "Nome do Usuário",
  // outros campos conforme implementação
  }
  }
- 401 Unauthorized
  {
  "error": "Token inválido ou ausente"
  }

UI hints:

- Usar para preencher perfil / validar sessão no app.

---

Clientes (rotas prefixadas /api/cliente)
Observação: campos abaixo são sugestivos — ajustar conforme implementação de backend.

4. GET /api/cliente
   Descrição: Lista clientes do usuário autenticado.
   Request:

- curl:
  curl -H "token: <token>" http://localhost:3000/api/cliente

Response (200):
[
{
"id": "cliente-id",
"nome": "Cliente A",
"documento": "000.000.000-00",
"telefone": "+55 11 99999-9999",
"email": "cliente@example.com",
// outros campos
},
...
]

UI hints:

- Implementar tabela/lista com paginação se necessário.
- Fornecer ação para ver, editar e deletar cada cliente.

---

5. GET /api/cliente/:id
   Descrição: Retorna cliente por ID.
   Request:

- curl:
  curl -H "token: <token>" http://localhost:3000/api/cliente/{id}

Responses:

- 200 OK
  {
  "id": "cliente-id",
  "nome": "Cliente A",
  "documento": "000.000.000-00",
  "telefone": "+55 11 99999-9999",
  "email": "cliente@example.com"
  }
- 404 Not Found
  {
  "error": "Cliente não encontrado"
  }

UI hints:

- Tela de detalhes do cliente com botão editar/excluir.

---

6. POST /api/cliente
   Descrição: Cria novo cliente.
   Request:

- curl:
  curl -X POST http://localhost:3000/api/cliente -H "token: <token>" -H "Content-Type: application/json" -d '{"nome":"Cliente A","documento":"000.000.000-00","telefone":"...","email":"..."}'

Request body (sugestão):
{
"nome": "Cliente A", // string, obrigatório
"documento": "000.000.000-00",// string, opcional/obrigatório conforme regras
"telefone": "+55...", // string, opcional
"email": "cliente@example.com"// string, opcional
}

Responses:

- 201 Created
  {
  "id": "cliente-id",
  "nome": "Cliente A",
  ...
  }
- 400 Bad Request
  {
  "error": "Mensagem de validação"
  }

UI hints:

- Form de criação com validação e feedback de sucesso/erro.

---

7. POST /api/cliente/:id
   Descrição: Atualiza cliente por ID (esta API usa POST para atualização).
   Request:

- curl:
  curl -X POST http://localhost:3000/api/cliente/{id} -H "token: <token>" -H "Content-Type: application/json" -d '{"nome":"Nome Atualizado"}'

Request body:
{
// campos a atualizar, por exemplo:
"nome": "Nome Atualizado",
"telefone": "+55 11 9...."
}

Responses:

- 200 OK
  {
  "id": "cliente-id",
  "nome": "Nome Atualizado",
  ...
  }
- 400 / 404 conforme erro

UI hints:

- Reutilizar tela de criação para edição, preencher campos com dados atuais.

---

8. DELETE /api/cliente/:id
   Descrição: Remove cliente por ID.
   Request:

- curl:
  curl -X DELETE -H "token: <token>" http://localhost:3000/api/cliente/{id}

Responses:

- 204 No Content (sucesso, sem corpo)
- 404 Not Found
  {
  "error": "Cliente não encontrado"
  }

UI hints:

- Confirm dialog antes da exclusão.
- Remover item da lista ao receber 204.

---

Dicas gerais para o frontend

- Tratar respostas pelo código HTTP:
  - 2xx → sucesso (mostrar feedback).
  - 4xx → mostrar mensagem do campo ou error.
  - 401 → forçar logout / redirecionar para login.
- Enviar sempre no header `token` o valor retornado pelo backend (login/cadastro/me).
- Validar dados no cliente antes de enviar (evita erro 400).
- Exibir loaders em requisições assíncronas.
- Armazenamento de token: localStorage/sessionStorage ou cookies seguros (Secure, HttpOnly) conforme nível de segurança desejado.
- Padrões de campos:
  - email: string, formato email
  - password: string, mínimo 6 caracteres (recomendar >=8)
  - telefone: string, permitir apenas dígitos/padrões com máscara
  - documento: string com máscara opcional

Ajuste exemplos (rotas, campos, portas) conforme a implementação real do backend. Se precisar, posso gerar um OpenAPI/Swagger básico com essas rotas.
