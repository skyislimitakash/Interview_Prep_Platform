import { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required.").isLength({ min: 2 }).withMessage("Name must be at least 2 characters."),
    body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],
  authController.register
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  authController.login
);

// GET /api/auth/me  (protected)
router.get("/me", authenticate, authController.getMe);

export default router;
