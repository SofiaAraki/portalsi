import type { FastifyInstance } from "fastify";
import { registerController, loginController } from "./auth.controller.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", registerController);
  app.post("/login", loginController);
  app.post("/logout", async (req, reply) => {
  reply.clearCookie("token", { path: "/" });
  return reply.send({ message: "Logout feito" });
});
}