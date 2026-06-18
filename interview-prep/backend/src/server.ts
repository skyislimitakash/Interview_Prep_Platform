import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { connectDB } from "./config/db";

// Import models (registers associations before DB sync)
import "./models/index";

// Route modules
import authRoutes     from "./routes/auth.routes";
import topicRoutes    from "./routes/topic.routes";
import questionRoutes from "./routes/question.routes";
import sessionRoutes  from "./routes/session.routes";
import aiRoutes       from "./routes/ai.routes";

import { ApiResponse } from "./types";

const app: Application = express();

// ── Security & Utility Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isDev ? "dev" : "combined"));

// ── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running.",
    data: { env: env.nodeEnv, timestamp: new Date().toISOString() },
  } satisfies ApiResponse);
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/topics",    topicRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/sessions",  sessionRoutes);
app.use("/api/ai",        aiRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  } satisfies ApiResponse);
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({
    success: false,
    message: env.isDev ? err.message : "An unexpected error occurred.",
  } satisfies ApiResponse);
});

// ── Boot ──────────────────────────────────────────────────────────────────────
const bootstrap = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[SERVER] Running on http://localhost:${env.port}`);
    console.log(`[SERVER] Environment: ${env.nodeEnv}`);
    console.log(`[SERVER] API base: http://localhost:${env.port}/api`);
  });
};

bootstrap();
