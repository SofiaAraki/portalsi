import { prisma } from "../../../lib/prisma.js";

export class ProfileService {
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            VagasCriadas: true,
            projetosCriados: true,
            votos: true,
          }
        }
      }
    });

    if (!user) throw new Error("Usuário não encontrado");

    const engajamento = await prisma.ranking.aggregate({
      where: { userId },
      _sum: { pontos: true }
    });

    const pontosTotal = engajamento._sum.pontos || 0;

    const badges = [];
    if (pontosTotal >= 10) badges.push({ label: "🚀 Engajado", color: "bg-blue-500" });
    if (pontosTotal >= 20) badges.push({ label: "🏆 Estrela", color: "bg-yellow-500" });
    if (pontosTotal >= 30) badges.push({ label: "🌟 Super Estrela", color: "bg-orange-500" });
    if (pontosTotal >= 40) badges.push({ label: "👑 Lenda", color: "bg-red-500" });
    if (pontosTotal >= 50) badges.push({ label: "🧠 Mentor", color: "bg-purple-500" });
    if (user._count.VagasCriadas >= 10) badges.push({ label: "💼 Hunter", color: "bg-green-500" });
    if (user._count.projetosCriados >= 10) badges.push({ label: "🛠️ Criador", color: "bg-teal-500" });
    if (user._count.votos >= 10) badges.push({ label: "🗳️ Votante", color: "bg-cyan-500" });

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      pontos: pontosTotal,
      badges: badges,
      _count: {
        projetos: user._count.projetosCriados,
        vagas: user._count.VagasCriadas,
        votos: user._count.votos
      }
    };
}

  async updateName(userId: string, nome: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { nome }
    });
  }
}