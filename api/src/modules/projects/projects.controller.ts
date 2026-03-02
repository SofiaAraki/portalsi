import type { FastifyReply, FastifyRequest } from "fastify";
import { createProject, getProjects } from "./projects.service.js";

export const create = async (req: FastifyRequest, res: FastifyReply) => {
  const userId = req.user.sub;

  const event = await createProject(req.body, userId);

  return res.send(event);
};

export const list = async (_: FastifyRequest, res: FastifyReply) => {
  const events = await getProjects();
  return res.send(events);
};