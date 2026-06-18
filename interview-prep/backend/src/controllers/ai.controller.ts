import { Response } from "express";
import { validationResult } from "express-validator";
import * as aiService from "../services/ai.service";
import { AuthRequest, ApiResponse } from "../types";

export const evaluate = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((e) => e.msg),
    } satisfies ApiResponse);
    return;
  }

  try {
    const data = await aiService.evaluateAnswer(req.user!.id, req.body);
    res.status(200).json({
      success: true,
      message: "Answer evaluated successfully.",
      data,
    } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI evaluation failed.";
    res.status(500).json({ success: false, message: msg } satisfies ApiResponse);
  }
};
