import type { FastifyReply, FastifyRequest } from "fastify";
import { createJob, getJobs } from "./jobs.service.js";

export const create = async (req: FastifyRequest, res: FastifyReply) => {
  const userId = req.user.sub;

  const job = await createJob(req.body, userId);

  return res.send(job);
};

export const list = async (_: FastifyRequest, res: FastifyReply) => {
  const jobs = await getJobs();
  return res.send(jobs);
};