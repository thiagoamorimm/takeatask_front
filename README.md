# TakeATask - Frontend

Este é o frontend da aplicação TakeATask, uma plataforma para gerenciamento de tarefas e usuários. Esta interface é construída com Next.js e TypeScript, utilizando Tailwind CSS para estilização e componentes da biblioteca shadcn/ui.

## Funcionalidades Principais

- Gerenciamento de Usuários (Listar, Criar, Editar, Excluir, Ativar/Inativar)
- Autenticação de Usuários (Login/Logout)
- Gerenciamento de Tarefas (CRUD - *a ser implementado completamente*)
- Interface responsiva e moderna.

## Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (v13+ com App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Requisições HTTP:** `fetch` API nativa
- **Gerenciador de Pacotes:** `npm` ou `yarn`

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18.x ou superior recomendada)
- [npm](https://www.npmjs.com/) (geralmente vem com Node.js) ou [yarn](https://yarnpkg.com/)

## Configurando o Ambiente

1.  **Clone o repositório (se ainda não o fez):
    ```bash
    git clone <url-do-repositorio-principal>
    cd <caminho-do-repositorio>/frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Variáveis de Ambiente:**
    Este projeto pode requerer variáveis de ambiente para se conectar ao backend. Crie um arquivo `.env.local` na raiz da pasta `frontend` ( `/media/thiago/dev/gringao/takeatask/frontend/.env.local` ).
    Por padrão, a API backend é esperada em `http://localhost:8081`.

    Exemplo de `.env.local` (se necessário futuramente para configurar a URL da API de forma mais flexível):
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8081/api
    ```
    Atualmente, a URL da API está hardcoded em alguns locais, mas o ideal é centralizá-la usando variáveis de ambiente.

## Rodando a Aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## Scripts Disponíveis

No diretório do projeto, você pode executar:

-   `npm run dev` ou `yarn dev`: Inicia a aplicação em modo de desenvolvimento.
-   `npm run build` ou `yarn build`: Compila a aplicação para produção.
-   `npm run start` ou `yarn start`: Inicia um servidor de produção após o build.
-   `npm run lint` ou `yarn lint`: Executa o linter (ESLint) para verificar a qualidade do código.

## Estrutura de Pastas (Visão Geral)

```
frontend/
├── app/                # Rotas principais e layouts (App Router do Next.js)
│   ├── (auth)/         # Rotas relacionadas à autenticação (ex: /login)
│   ├── (main)/         # Rotas principais da aplicação após login
│   │   ├── layout.tsx
│   │   └── usuarios/
│   │       └── page.tsx
│   └── layout.tsx      # Layout raiz
│   └── page.tsx        # Página inicial
├── components/         # Componentes React reutilizáveis
│   ├── ui/             # Componentes base do shadcn/ui (Button, Input, etc.)
│   └── *.tsx           # Componentes customizados da aplicação
├── services/           # Lógica de comunicação com APIs externas/backend
│   └── auth.ts         # Exemplo: serviço de autenticação
├── lib/                # Funções utilitárias e configurações
│   └── utils.ts        # Funções utilitárias gerais
├── public/             # Arquivos estáticos (imagens, fontes, etc.)
├── styles/             # Arquivos de estilo globais
│   └── globals.css
├── .env.local          # Variáveis de ambiente locais (não versionado)
├── next.config.js      # Configurações do Next.js
├── postcss.config.js   # Configurações do PostCSS (para Tailwind)
├── tailwind.config.ts  # Configurações do Tailwind CSS
├── tsconfig.json       # Configurações do TypeScript
└── package.json        # Dependências e scripts do projeto
```

## Integração com o Backend

O frontend se comunica com uma API backend (esperada em `http://localhost:8081/api` por padrão) para todas as operações de dados, como autenticação, busca de usuários, criação, atualização e exclusão.

As requisições são feitas utilizando a `fetch` API, e o token JWT obtido no login é enviado no header `Authorization` para rotas protegidas.

## Contribuições

Contribuições são bem-vindas! Se você deseja contribuir, por favor:

1.  Faça um Fork do projeto.
2.  Crie uma Branch para sua feature (`git checkout -b feature/AmazingFeature`).
3.  Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`).
4.  Push para a Branch (`git push origin feature/AmazingFeature`).
5.  Abra um Pull Request.

---

Este README provê um bom ponto de partida. Sinta-se à vontade para ajustá-lo e adicionar mais detalhes conforme o projeto evolui!
