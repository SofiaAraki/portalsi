import type { FastifyInstance } from "fastify";
import { create, list } from "./events.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";

export async function eventRoutes(app: FastifyInstance) {
  app.get("/events", { preHandler: [authMiddleware] }, list);
  app.post("/events", { preHandler: [authMiddleware] }, create);
}