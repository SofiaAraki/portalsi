import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma.js";

export async function getRanking(request: FastifyRequest, reply: FastifyReply) {
  const ranking = await prisma.ranking.groupBy({
    by: ['userId'],
    _sum: {
      pontos: true,
    },
    orderBy: {
      _sum: {
        pontos: 'desc',
      },
    },
    take: 10,
  });

  const rankingComNomes = await Promise.all(
    ranking.map(async (item) => {
      const user = await prisma.user.findUnique({
        where: { id: item.userId },
        select: { nome: true },
      });
      return {
        id: item.userId,
        nome: user?.nome || "Usuário Excluído",
        pontos: item._sum.pontos || 0,
      };
    })
  );

  return reply.send(rankingComNomes);
}