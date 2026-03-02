# 🚀 Portal SI (Sistemas de Informação)

Um ecossistema completo para gestão acadêmica e engajamento de alunos, focado em **gamificação**, **eventos**, **projetos** e **vagas**.
O projeto utiliza uma arquitetura moderna separando a API de alta performance da interface reativa.

---

## 🛠️ Stack Tecnológica

### **Backend (API)**
* **Node.js + Fastify**: Performance extrema e baixo overhead.
* **TypeScript**: Segurança de tipos em todo o fluxo.
* **Prisma ORM**: Modelagem de dados e abstração de banco.
* **PostgreSQL**: Banco de dados relacional robusto.
* **JWT & Cookies HttpOnly**: Autenticação segura contra ataques XSS.

### **Frontend (Web)**
* **Next.js 16 (Turbopack)**: O framework mais moderno para React.
* **Tailwind CSS**: Estilização utilitária e responsiva.
* **Context API**: Gerenciamento de estado global de autenticação.
* **Zod**: Validação rigorosa de dados no cliente e servidor.

---

## 📋 Funcionalidades Principais

* 👤 **Perfil do Aluno (SI Pass)**: Cartão de identidade virtual com QR Code, pontos e conquistas.
* 📅 **Gestão de Eventos**: Calendário acadêmico, inscrições e controle de presença.
* 🚀 **Showcase de Projetos**: Vitrine de portfólio para projetos desenvolvidos pelos alunos.
* 💼 **Mural de Vagas**: Conexão direta com oportunidades de estágio e emprego.
* 🗳️ **Votações & Ranking**: Sistema gamificado com ranking de engajamento e decisões coletivas.
* 🔒 **Painel Administrativo**: Gestão de usuários, moderação de conteúdo e métricas.

---

## 🏗️ Arquitetura do Projeto

O projeto é dividido em dois grandes módulos (Monorepo):
1.  `/api`: Servidor RESTful em Fastify.
2.  `/web`: Aplicação Next.js (App Router).

---

## ⚙️ Como rodar o projeto

### **Opção 1: Via Docker (Recomendado)**
Certifique-se de ter o Docker e Docker Compose instalados.

# Na raiz do projeto
docker-compose up --build

```

*O frontend estará em `localhost:3000` e a API em `localhost:3333`.*

### **Opção 2: Manual (Desenvolvimento)**

**1. Configurar o Backend**

```bash
cd api
npm install
# Crie seu .env baseado no .env.example
npx prisma migrate dev
npm run dev

```

**2. Configurar o Frontend**

```bash
cd ../web
npm install
npm run dev

```

---

## 🗄️ Estrutura de Pastas

```plaintext
portal-si/
├── api/                # Backend Fastify + Prisma
│   ├── src/
│   │   ├── modules/    # Módulos de negócio (auth, events, jobs...)
│   │   ├── lib/        # Configurações de terceiros (Prisma, JWT)
│   │   └── server.ts   # Ponto de entrada
├── web/                # Frontend Next.js 16
│   ├── src/
│   │   ├── app/        # Rotas e Páginas (App Router)
│   │   ├── components/ # UI Components (Shadcn/Tailwind)
│   │   ├── contexts/   # Gerenciamento de estado (Auth)
│   │   └── proxy.ts    # Middleware/Proxy de segurança
└── docker-compose.yml  # Orquestração de containers

```

---

## 🤝 Contribuição

1. Faça um **Fork**.
2. Crie uma Branch (`git checkout -b feature/NovaFeature`).
3. Commit suas alterações (`git commit -m 'feat: Adicionando funcionalidade X'`).
4. Push para a Branch (`git push origin feature/NovaFeature`).
5. Abra um **Pull Request**.

---

*Desenvolvido para a comunidade de Sistemas de Informação.*