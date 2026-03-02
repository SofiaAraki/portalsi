import type { FastifyRequest, FastifyReply } from "fastify";

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  await req.jwtVerify();
}