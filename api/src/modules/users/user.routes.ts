import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.js";

export async function userRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: [authMiddleware] }, async (req) => {
    return req.user;
  });
}