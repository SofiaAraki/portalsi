import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.js";
import { getAdminStatsHandler, listAdminDataHandler } from "./admin.controller.js";
import { prisma } from "../../lib/prisma.js";

export async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);
  
  app.get("/stats", getAdminStatsHandler);

  app.get("/list/:type", listAdminDataHandler);

  app.patch("/:type/:id", async (req, reply) => {
    const { type, id } = req.params as { type: string; id: string };
    const updateData = req.body as any;

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

    try {
      // Limpeza de dados para evitar erro do Prisma (não se altera ID ou datas de criação)
      const { id: _, createdAt: __, updatedAt: ___, authorId: ____, userId: _____, ...dataToUpdate } = updateData;

      await model.update({
        where: { id },
        data: dataToUpdate
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno ao atualizar" });
    }
  });

  app.delete("/:type/:id", async (req, reply) => {
    const { type, id } = req.params as { type: string; id: string };

    const models: Record<string, any> = {
      users: prisma.user,
      events: prisma.evento,
      vagas: prisma.vaga,
      projects: prisma.projeto,
      votes: prisma.votacao,
      ranking: prisma.ranking
    };

    const model = models[type];

    if (!model) {
      return reply.status(400).send({ message: "Categoria inválida para deleção" });
    }

    try {
      await model.delete({
        where: { id }
      });
      return { success: true, message: `${type} removido com sucesso` };
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ 
        message: "Erro ao excluir. Verifique se este item possui dependências (ex: um usuário que criou um evento)." 
      });
    }
  });
}