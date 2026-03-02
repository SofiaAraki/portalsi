import type { FastifyInstance } from "fastify";
import { getRanking } from "./ranking.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

export async function rankingRoutes(app: FastifyInstance) {
  app.get("/ranking", { preHandler: [authMiddleware] }, getRanking);
}