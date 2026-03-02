import { prisma } from "../../lib/prisma.js";

export const createProject = async (data: any, userId: string) => {
  const novoProjeto = await prisma.projeto.create({
    data: {
      ...data,
      criadorId: userId,
    },
  });

  await prisma.ranking.create({
    data: {
      tipo: 'CRIOU_PROJETO',
      pontos: 1, 
      userId: userId,
      referenciaId: novoProjeto.id
    }
  });

  return novoProjeto;
};

export const getProjects = async () => {
  return prisma.projeto.findMany({
    orderBy: { criadoEm: "desc" },
  });
};