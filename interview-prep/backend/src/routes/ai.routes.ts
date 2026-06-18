import { Router } from "express";
import { body } from "express-validator";
import * as aiController from "../controllers/ai.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// POST /api/ai/evaluate
router.post(
  "/evaluate",
  authenticate,
  [
    body("sessionId").isInt({ min: 1 }).withMessage("A valid session ID is required."),
    body("questionId").isInt({ min: 1 }).withMessage("A valid question ID is required."),
    body("userAnswer").trim().isLength({ min: 10 }).withMessage("Answer must be at least 10 characters."),
    body("timeTakenSec").optional().isInt({ min: 0 }).withMessage("Time taken must be a positive integer."),
  ],
  aiController.evaluate
);

export default router;
