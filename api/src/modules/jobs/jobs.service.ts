import { prisma } from "../../lib/prisma.js";

export const createJob = async (data: any, userId: string) => {
  const novaVaga = await prisma.vaga.create({
    data: {
      titulo: data.titulo,
      empresa: data.empresa,
      descricao: data.descricao,
      localizacao: data.localizacao,
      link: data.link,
      criadorId: userId,
    },
  });

  await prisma.ranking.create({
    data: {
      tipo: 'PUBLICOU_VAGA',
      pontos: 1, 
      userId: userId,
      referenciaId: novaVaga.id
    }
  });

  return novaVaga;
};

export const getJobs = async () => {
  return prisma.vaga.findMany({
    orderBy: { criadoEm: "desc" },
  });
};