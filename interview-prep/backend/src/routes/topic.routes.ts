import { Router } from "express";
import * as topicController from "../controllers/topic.controller";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";

const router = Router();

// GET /api/topics — any authenticated user
router.get("/", authenticate, topicController.getAllTopics);

// POST /api/topics — admin only
router.post("/", authenticate, requireRole("admin"), topicController.createTopic);

export default router;
