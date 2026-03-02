import { prisma } from "../../lib/prisma.js";

export const createRanking = async (data: any, userId: string) => {
  return prisma.ranking.create({
    data: {
      ...data,
      criadorId: userId,
    },
  });
};

export const getRankings = async () => {
  return prisma.ranking.findMany({
    orderBy: { criadoEm: "desc" },
  });
};