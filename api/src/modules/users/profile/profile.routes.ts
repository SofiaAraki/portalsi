import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middlewares/auth.js";
import { getProfileHandler, updateNameHandler } from "./profile.controller.js";

export async function profileRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authMiddleware);

  app.get("/profile", getProfileHandler);

  app.patch("/profile/update", updateNameHandler);
}