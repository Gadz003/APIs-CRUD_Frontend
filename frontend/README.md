# API CRUD — Frontend

Frontend simples da aplicação **API CRUD** (cadastro de alunos), feito com **HTML, CSS e JavaScript puro** (sem frameworks).

Tudo o que envolve o frontend (telas, interações, animações) está concentrado neste diretório, para que possa ser versionado em um repositório próprio separado do backend.

## Estrutura

```
frontend/
├── index.html        # Telas de Login e Cadastro
├── styles.css        # Estilos e animações (CSS)
├── app.js            # Lógica da aplicação (JavaScript)
├── Alunos/           # Página de álbum de alunos
│   ├── alunos.html
│   ├── alunos.css
│   └── alunos.js
├── BarraNav/         # Barra de navegação (Sair / lista)
│   └── barraNav.js
└── Usuarios/         # Página de usuários
    ├── usuarios.html
    └── usuarios.js
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
POST {API_URL}/login
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
POST {API_URL}/usuarios
```

### Corpo da requisição

```json
{ "name": "Maria Silva", "email": "usuario@email.com", "password": "senha123" }
```

### Resposta de sucesso

```json
{ "message": "Conta criada com sucesso." }
```

### Endpoint de alunos

```
GET {API_URL}/alunos
```

Headers:

```
Authorization: Bearer {token}
```

Resposta (200):

```json
[
  { "id": 1, "nome": "João Silva", "email": "joao@email.com" }
]
```

## Telas

1. **Login** (`frontend/index.html` + `frontend/app.js` + `frontend/styles.css`)
   - E-mail e senha (com toggle de visibilidade)
   - Validação básica e exibição de erros
   - Estado de loading com spinner no botão
   - Persistência do token e redirecionamento para a tela de alunos após o login

2. **Cadastro** (`frontend/index.html` + `frontend/app.js`)
   - Campos: nome, e-mail, senha e confirmar senha
   - Validação (campos obrigatórios, senha mínima de 6 caracteres, confirmação)
   - Estado de loading com spinner no botão
   - Mensagem de sucesso pós-cadastro

3. **Álbum de Alunos** (`frontend/Alunos/`)
   - Lista os alunos cadastrados (requer token via `Authorization: Bearer`)
   - Barra de navegação com opção de sair e, para administradores, acesso à lista de usuários

4. **Usuários** (`frontend/Usuarios/`)
   - Acesso administrativo à lista de usuários

## Build / Implantação

Como é HTML/CSS/JS puro, basta enviar os arquivos do diretório `frontend/` para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, etc.).
