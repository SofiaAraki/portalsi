import { prisma } from "../../lib/prisma.js";

export const createVoting = async (data: any) => {
  const { titulo, descricao, dataInicio, dataFim, opcoes } = data;

  return await prisma.votacao.create({
    data: {
      titulo,
      descricao,
      dataInicio,
      dataFim,
      opcoes: {
        create: opcoes.map((tituloOpcao: string) => ({
          titulo: tituloOpcao,
        })),
      },
    },
  });
};

export const getVotings = async () => {
  return prisma.votacao.findMany({
    include: {
      opcoes: true,
      _count: {
        select: { votos: true }
      }
    },
    orderBy: { criadaEm: "desc" },
  });
};

export const registerVote = async (userId: string, votacaoId: string, opcaoId: string) => {
  return await prisma.$transaction(async (tx) => {
    
    const novoVoto = await tx.voto.create({
      data: {
        userId,
        votacaoId,
        opcaoId,
      },
    });

    await tx.ranking.create({
      data: {
        tipo: 'VOTOU',
        pontos: 1,
        userId: userId,
        referenciaId: votacaoId
      }
    });

    return novoVoto;
  });
};