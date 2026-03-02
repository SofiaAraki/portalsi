import { prisma } from "../../lib/prisma.js";

export const createEvent = async (data: any) => {
  const novoEvento = await prisma.evento.create({
    data: {
      titulo: data.titulo,
      descricao: data.descricao,
      data: new Date(data.data),
      local: data.local,
      link: data.link,
      imagemUrl: data.imagemUrl,
    },
  });
  return novoEvento;
};

export const getEvents = async () => {
  return prisma.evento.findMany({
    orderBy: { criadoEm: "desc" },
  });
};