import type { FastifyReply, FastifyRequest } from "fastify";
import { register, login } from "./auth.service.js";

export async function registerController(req: FastifyRequest, reply: FastifyReply) {
  const user = await register(req.body);

  return reply.send(user);
}

export async function loginController(req: FastifyRequest, reply: FastifyReply) {
  const user = await login(req.body);

  const token = await reply.jwtSign({
    sub: user.id,
    role: user.role
  });

  reply.setCookie("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 1,
  });

  return reply.send({ token });
}