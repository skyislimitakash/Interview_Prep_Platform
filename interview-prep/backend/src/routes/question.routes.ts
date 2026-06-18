import { Router } from "express";
import { body } from "express-validator";
import * as questionController from "../controllers/question.controller";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";

const router = Router();

const questionValidation = [
  body("topicId").isInt({ min: 1 }).withMessage("A valid topic ID is required."),
  body("questionText").trim().notEmpty().withMessage("Question text is required."),
  body("sampleAnswer").trim().notEmpty().withMessage("Sample answer is required."),
  body("type").isIn(["technical", "hr", "behavioral"]).withMessage("Invalid question type."),
  body("difficulty").isIn(["easy", "medium", "hard"]).withMessage("Invalid difficulty level."),
];

// GET /api/questions?topicId=&difficulty=&type=&limit=
router.get("/", authenticate, questionController.getQuestions);

// GET /api/questions/:id
router.get("/:id", authenticate, questionController.getQuestion);

// POST /api/questions — admin only
router.post("/", authenticate, requireRole("admin"), questionValidation, questionController.createQuestion);

// PUT /api/questions/:id — admin only
router.put("/:id", authenticate, requireRole("admin"), questionController.updateQuestion);

// DELETE /api/questions/:id — admin only
router.delete("/:id", authenticate, requireRole("admin"), questionController.deleteQuestion);

export default router;
