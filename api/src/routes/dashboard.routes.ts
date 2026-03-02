import type { FastifyInstance } from "fastify";
import { getDashboard } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get(
    "/dashboard",
    { preHandler: [authMiddleware] },
    getDashboard
  );
}