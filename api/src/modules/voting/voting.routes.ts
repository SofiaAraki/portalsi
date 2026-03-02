import type { FastifyInstance } from "fastify";
import { create, handleVote, list, show } from "./voting.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

export async function votingRoutes(app: FastifyInstance) {
  app.get("/voting", { preHandler: [authMiddleware] }, list);
  app.post("/voting", { preHandler: [authMiddleware] }, create);

  app.get("/voting/:id", { preHandler: [authMiddleware] }, show);
  
  app.post("/voting/:id/vote", { preHandler: [authMiddleware] }, handleVote);
}