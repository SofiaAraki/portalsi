import type { FastifyReply, FastifyRequest } from "fastify";
import { createVoting, getVotings, registerVote } from "./voting.service.js";
import { prisma } from "../../lib/prisma.js";

export const create = async (req: FastifyRequest, res: FastifyReply) => {
  const event = await createVoting(req.body);

  return res.send(event);
};

export const list = async (_: FastifyRequest, res: FastifyReply) => {
  const events = await getVotings();
  return res.send(events);
};

export async function handleVote(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user.sub;
  const { id } = req.params as { id: string };
  const { opcaoId } = req.body as { opcaoId: string };

  try {
    const voto = await registerVote(userId, id, opcaoId);
    return reply.send(voto);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return reply.status(400).send({ message: "Você já votou nesta enquete!" });
    }
    return reply.status(500).send({ message: "Erro ao processar voto." });
  }
}

export const show = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const userId = req.user.sub;

  const voting = await prisma.votacao.findUnique({
    where: { id },
    include: {
      opcoes: {
        include: {
          _count: {
            select: { votos: true }
          }
        }
      },
      votos: {
        where: { userId }
      }
    }
  });

  if (!voting) return reply.status(404).send({ message: "Votação não encontrada" });

  return reply.send({
    ...voting,
    userHasVoted: voting.votos.length > 0
  });
};