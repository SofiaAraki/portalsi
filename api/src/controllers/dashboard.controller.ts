import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function getDashboard(request: FastifyRequest, reply: FastifyReply) {
  try {
    const now = new Date();
    const userId = (request.user as any)?.sub;

    const [
      eventos,
      vagas,
      projetos,
      votacoesAtivas,
      engajamentoUsuario,
    ] = await Promise.all([
      prisma.evento.findMany({ where: { data: { gte: now } }, orderBy: { data: "asc" }, take: 5 }).catch(() => []),
      prisma.vaga.findMany({ orderBy: { criadoEm: "desc" }, take: 5 }).catch(() => []),
      prisma.projeto.findMany({ 
        orderBy: { criadoEm: "desc" }, 
        take: 5, 
        include: { criador: { select: { nome: true } } } 
      }).catch(() => []),
      prisma.votacao.findMany({
        where: { dataInicio: { lte: now }, dataFim: { gte: now } },
      }).catch(() => []),

      userId 
        ? prisma.ranking.aggregate({ where: { userId }, _sum: { pontos: true } }).catch(() => null)
        : null,
    ]);

    return reply.send({
      eventos: eventos || [],
      vagas: vagas || [],
      projetos: projetos || [],
      votacoesAtivas: votacoesAtivas || [],
      pontosUsuario: engajamentoUsuario?._sum?.pontos || 0,
    });

  } catch (error) {
    console.error("ERRO CRÍTICO NO DASHBOARD:", error);
    return reply.status(500).send({ message: "Erro interno ao processar dashboard" });
  }
}