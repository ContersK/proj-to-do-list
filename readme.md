# To-Do List

Este projeto é uma aplicação de lista de tarefas (To-Do List) desenvolvida com Node.js, Express e TypeScript, com arquitetura separada para backend e frontend. Permite aos usuários criar, visualizar, editar, remover e marcar tarefas como concluídas.

## Funcionalidades

- Adicionar novas tarefas
- Listar todas as tarefas
- Editar tarefas existentes
- Remover tarefas
- Marcar tarefas como concluídas
- Autenticação de usuários (caso implementado)
- API RESTful para integração

## Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- Prisma ORM (SQLite)
- Vite + React (Frontend)
- Eslint (Padronização de código)

## Estrutura do Projeto

```
proj-to-do-list/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── server/
│   │   │   ├── routes/
│   │   │   └── ...
│   │   ├── prisma/
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── assets/
│       │   ├── App.tsx
│       │   └── ...
│       └── package.json
├── package.json
└── readme.md
```

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/proj-to-do-list.git
   ```
2. Instale as dependências do backend e frontend:
   ```bash
   cd proj-to-do-list/apps/backend
   npm install
   cd ../frontend
   npm install
   ```
3. Configure as variáveis de ambiente e o banco de dados, se necessário.

## Uso

### Backend

1. Inicie o servidor backend:
   ```bash
   npm start
   ```
2. O backend estará disponível em `http://localhost:3000`

### Frontend

1. Inicie o servidor frontend:
   ```bash
   npm run dev
   ```
2. Acesse a interface web em `http://localhost:5173` (ou porta informada pelo Vite)

## Contribuição

Contribuições são bem-vindas! Abra issues ou envie pull requests.

## Licença

Este projeto está sob a licença MIT.
