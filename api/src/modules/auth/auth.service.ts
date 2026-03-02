import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

export async function register(data: any) {
  const userExists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (userExists) throw new Error("Usuário já existe");

  const senhaHash = await bcrypt.hash(data.senha, 10);

  const user = await prisma.user.create({
    data: {
      nome: data.nome,
      email: data.email,
      senha: senhaHash,
    },
  });

  return user;
}

export async function login(data: any) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) throw new Error("Credenciais inválidas");

  const senhaValida = await bcrypt.compare(data.senha, user.senha);

  if (!senhaValida) throw new Error("Credenciais inválidas");

  return user;
}