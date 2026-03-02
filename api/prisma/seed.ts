import { PrismaClient, Role } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from "bcryptjs"
import "dotenv/config"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10)

  // Usamos upsert para evitar erro se você rodar o seed duas vezes
  await prisma.user.upsert({
    where: { email: "admin@portalsi.com" },
    update: {},
    create: {
      nome: "Admin Portal SI",
      email: "admin@portalsi.com",
      senha: senhaHash,
      role: Role.ADMIN
    }
  })
}

main()
  .then(async () => {
    console.log("✅ Seed finalizado com sucesso!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro no seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });