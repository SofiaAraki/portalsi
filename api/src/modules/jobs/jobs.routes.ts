import type { FastifyInstance } from "fastify";
import { create, list } from "./jobs.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

export async function jobRoutes(app: FastifyInstance) {
  app.get("/jobs", { preHandler: [authMiddleware] }, list);
  app.post("/jobs", { preHandler: [authMiddleware] }, create);
}