# API CRUD — Frontend

Frontend simples de login da aplicação **API CRUD**, feito com **HTML, CSS e JavaScript puro** (sem frameworks).

Tudo o que envolve o frontend (telas, interações, animações) está concentrado neste diretório, para que possa ser versionado em um repositório próprio separado do backend.

## Estrutura

```
frontend/
├── index.html   # Estrutura das telas (login, cadastro e welcome)
├── styles.css   # Estilos e animações (CSS)
├── app.js       # Lógica da aplicação (JavaScript)
└── favicon.svg  # Ícone da aba
```

## Como rodar

Basta abrir o `index.html` em um servidor local (recomendado) ou via Live Server:

```bash
npx serve frontend
# ou
python -m http.server 5500 --directory frontend
```

Depois abra `http://localhost:5500`.

## Configuração da API

A URL base do backend fica em `frontend/app.js` (constante `API_URL`).

### Endpoint de login

```
POST {API_URL}/auth/login
```

### Corpo da requisição

```json
{ "email": "usuario@email.com", "password": "senha123" }
```

### Resposta de sucesso (200)

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "usuario@email.com",
    "type": "admin"
  }
}
```

### Resposta de erro (401)

```json
{ "message": "E-mail ou senha inválidos." }
```

### Endpoint de cadastro

```
POST {API_URL}/auth/register
```

### Corpo da requisição

```json
{ "name": "Maria Silva", "email": "usuario@email.com", "password": "senha123" }
```

### Resposta de sucesso

```json
{ "message": "Conta criada com sucesso." }
```

## Telas

1. **Login** (`frontend/index.html` + `frontend/app.js` + `frontend/styles.css`)
   - Apenas e-mail e senha (com toggle de visibilidade)
   - Validação básica e exibição de erros
   - Estado de loading com spinner no botão
   - Link "Cadastre-se" → tela de cadastro

2. **Cadastro** (`frontend/index.html` + `frontend/app.js` + `frontend/styles.css`)
   - Campos: nome, e-mail, senha e confirmar senha
   - Validação (campos obrigatórios, senha mínima de 6 caracteres, confirmação)
   - Estado de loading com spinner no botão
   - Mensagem de sucesso pós-cadastro

3. **Welcome / Acesso** (`frontend/index.html` + `frontend/app.js` + `frontend/styles.css`)
   - Mostra o **nome** do usuário: "Bem-vindo, {nome}!"
   - Mostra a **mensagem de boas-vindas** com o **tipo** do usuário (admin/user)
   - Botão de sair (logout)

## Build / Implantação

Como é HTML/CSS/JS puro, basta enviar os arquivos do diretório `frontend/` para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, etc.).
