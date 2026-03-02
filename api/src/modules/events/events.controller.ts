import type { FastifyReply, FastifyRequest } from "fastify";
import { createEvent, getEvents } from "./events.service.js";

export const create = async (req: FastifyRequest, res: FastifyReply) => {
  const event = await createEvent(req.body);

  return res.send(event);
};

export const list = async (_: FastifyRequest, res: FastifyReply) => {
  const events = await getEvents();
  return res.send(events);
};