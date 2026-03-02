-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ALUNO');

-- CreateEnum
CREATE TYPE "StatusProjeto" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO');

-- CreateEnum
CREATE TYPE "TipoEngajamento" AS ENUM ('PUBLICOU_VAGA', 'CRIOU_PROJETO', 'VOTOU');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ALUNO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "local" TEXT,
    "link" TEXT,
    "imagemUrl" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaga" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "localizacao" TEXT,
    "link" TEXT,
    "imagemUrl" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadorId" TEXT NOT NULL,

    CONSTRAINT "Vaga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "githubUrl" TEXT,
    "imagemUrl" TEXT,
    "status" "StatusProjeto" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadorId" TEXT NOT NULL,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjetoIntegrante" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,

    CONSTRAINT "ProjetoIntegrante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Votacao" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Votacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VotacaoOpcao" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "votacaoId" TEXT NOT NULL,

    CONSTRAINT "VotacaoOpcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voto" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opcaoId" TEXT NOT NULL,
    "votacaoId" TEXT NOT NULL,

    CONSTRAINT "Voto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL,
    "tipo" "TipoEngajamento" NOT NULL,
    "pontos" INTEGER NOT NULL,
    "referenciaId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProjetoIntegrante_userId_projetoId_key" ON "ProjetoIntegrante"("userId", "projetoId");

-- CreateIndex
CREATE UNIQUE INDEX "Voto_userId_votacaoId_key" ON "Voto"("userId", "votacaoId");

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoIntegrante" ADD CONSTRAINT "ProjetoIntegrante_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjetoIntegrante" ADD CONSTRAINT "ProjetoIntegrante_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotacaoOpcao" ADD CONSTRAINT "VotacaoOpcao_votacaoId_fkey" FOREIGN KEY ("votacaoId") REFERENCES "Votacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_opcaoId_fkey" FOREIGN KEY ("opcaoId") REFERENCES "VotacaoOpcao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_votacaoId_fkey" FOREIGN KEY ("votacaoId") REFERENCES "Votacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
