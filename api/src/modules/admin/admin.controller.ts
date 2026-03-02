import type { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma.js";

export async function getAdminStatsHandler(request: FastifyRequest, reply: FastifyReply) {
  const [users, events, vagas, projects, votes, ranking] = await Promise.all([
    prisma.user.count(),
    prisma.evento.count(),
    prisma.vaga.count(),
    prisma.projeto.count(),
    prisma.votacao.count(),
    prisma.ranking.count(),
  ]);

  return { users, events, vagas, projects, votes, ranking };
}

export async function listAdminDataHandler(request: FastifyRequest, reply: FastifyReply) {
  const { type } = request.params as { type: string };
  const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number };

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const models: Record<string, any> = {
    users: prisma.user,
    events: prisma.evento,
    vagas: prisma.vaga,
    projects: prisma.projeto,
    votes: prisma.votacao,
    ranking: prisma.ranking
  };

  const model = models[type];
  if (!model) return reply.status(400).send({ message: "Categoria inválida" });

  const [items, total] = await Promise.all([
    model.findMany({
      skip,
      take,
      orderBy: { id: 'desc' },
    }),
    model.count()
  ]);

  return { items, total, pages: Math.ceil(total / take) };
}