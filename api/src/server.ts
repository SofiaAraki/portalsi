import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { userRoutes } from "./modules/users/user.routes.js";
import { eventRoutes } from "./modules/events/events.routes.js";
import { jobRoutes } from "./modules/jobs/jobs.routes.js";
import { projectRoutes } from "./modules/projects/projects.routes.js";
import { votingRoutes } from "./modules/voting/voting.routes.js";
import { rankingRoutes } from "./modules/ranking/ranking.routes.js";
import { profileRoutes } from "./modules/users/profile/profile.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import cookie from "@fastify/cookie";

const app = Fastify();

app.register(cors, { 
  origin: [
    "https://portalsi.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
});

app.register(cookie);

app.register(jwt, {
  secret: process.env.JWT_SECRET!,
  cookie: {
    cookieName: "token",
    signed: false,
  },
});

app.register(authRoutes);

app.register(userRoutes);

app.register(eventRoutes);

app.register(jobRoutes);

app.register(projectRoutes);

app.register(votingRoutes);

app.register(rankingRoutes);

app.register(profileRoutes);

app.register(adminRoutes, { prefix: "/admin" });

app.register(dashboardRoutes);

const port = Number(process.env.PORT) || 3333

app.listen({ port, host: "0.0.0.0" }).then(() => {
  console.log("🚀 API rodando")
})