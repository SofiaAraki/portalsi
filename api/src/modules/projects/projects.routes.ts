import type { FastifyInstance } from "fastify";
import { create, list } from "./projects.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

export async function projectRoutes(app: FastifyInstance) {
  app.get("/projects", { preHandler: [authMiddleware] }, list);
  app.post("/projects", { preHandler: [authMiddleware] }, create);
}