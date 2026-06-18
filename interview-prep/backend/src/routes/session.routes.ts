import { Router } from "express";
import * as sessionController from "../controllers/session.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// POST /api/sessions/start
router.post("/start", authenticate, sessionController.startSession);

// PATCH /api/sessions/:id/end
router.patch("/:id/end", authenticate, sessionController.endSession);

// GET /api/sessions/history
router.get("/history", authenticate, sessionController.getHistory);

// GET /api/sessions/:id
router.get("/:id", authenticate, sessionController.getSessionDetail);

export default router;
