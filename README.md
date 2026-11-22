# Digital Store API

API REST do projeto final de Back-end, construída com Node.js, Express, MySQL, Sequelize, JWT e Jest.

## Funcionalidades

- Cadastro, consulta, atualização e exclusão de usuários.
- Login com senha protegida por `bcrypt` e token JWT.
- CRUD de categorias, com paginação e filtro para itens de menu.
- CRUD de produtos, com categorias, imagens e opções.
- Busca de produtos por texto, categoria, faixa de preço e paginação.
- Documentação Swagger em `http://localhost:3000/api-docs`.

## Requisitos

- Node.js 20 ou superior.
- MySQL 8 ou superior, em execução na porta `3306`.

## Instalação

```bash
npm install
Copy-Item .env.example .env
```

Edite o arquivo `.env` e informe a senha local do MySQL em `DB_PASSWORD`. Nunca publique esse arquivo.

Crie o banco uma única vez:

```sql
CREATE DATABASE digital_store_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Rode as migrations:

```bash
npm run db:migrate
```

## Execução e testes

```bash
npm run dev
npm test
```

## Rotas principais

| Método | Rota | Protegida |
| --- | --- | --- |
| POST | `/v1/user` | Não |
| POST | `/v1/auth/login` | Não |
| GET/PUT/DELETE | `/v1/user/:id` | PUT e DELETE |
| POST | `/v1/category` | Sim |
| GET/PUT/DELETE | `/v1/category/:id` | PUT e DELETE |
| GET | `/v1/category/search` | Não |
| POST | `/v1/product` | Sim |
| GET/PUT/DELETE | `/v1/product/:id` | PUT e DELETE |
| GET | `/v1/product/search` | Não |

Para as rotas protegidas, envie o cabeçalho `Authorization: Bearer SEU_TOKEN`.
