import type { FastifyReply, FastifyRequest } from "fastify";
import { ProfileService } from "./profile.service.js";

const profileService = new ProfileService();

export async function getProfileHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (request.user as any).sub;
    const profile = await profileService.getUserProfile(userId);
    return reply.send(profile);
  } catch (error) {
    return reply.status(404).send({ message: "Perfil não encontrado" });
  }
}

export async function updateNameHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (request.user as any).sub;
    const { nome } = request.body as { nome: string };

    if (!nome || nome.length < 3) {
      return reply.status(400).send({ message: "Nome deve ter no mínimo 3 caracteres" });
    }

    await profileService.updateName(userId, nome);
    return reply.send({ message: "Nome atualizado com sucesso!" });
  } catch (error) {
    return reply.status(500).send({ message: "Erro ao atualizar nome" });
  }
}