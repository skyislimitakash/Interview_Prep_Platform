import { Response } from "express";
import { validationResult } from "express-validator";
import * as questionService from "../services/question.service";
import { AuthRequest, ApiResponse, QuestionFilter } from "../types";

export const getQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: QuestionFilter = {
      topicId:    req.query.topicId    ? Number(req.query.topicId)    : undefined,
      difficulty: req.query.difficulty as QuestionFilter["difficulty"] | undefined,
      type:       req.query.type       as QuestionFilter["type"]       | undefined,
      limit:      req.query.limit      ? Number(req.query.limit)      : 10,
    };
    const data = await questionService.getAllQuestions(filter);
    res.status(200).json({ success: true, message: "Questions fetched.", data } satisfies ApiResponse);
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch questions." } satisfies ApiResponse);
  }
};

export const getQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await questionService.getQuestionById(Number(req.params.id));
    res.status(200).json({ success: true, message: "Question fetched.", data } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Not found.";
    res.status(404).json({ success: false, message: msg } satisfies ApiResponse);
  }
};

export const createQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
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
    const data = await questionService.createQuestion(req.body);
    res.status(201).json({ success: true, message: "Question created.", data } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create question.";
    res.status(400).json({ success: false, message: msg } satisfies ApiResponse);
  }
};

export const updateQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await questionService.updateQuestion(Number(req.params.id), req.body);
    res.status(200).json({ success: true, message: "Question updated.", data } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update question.";
    res.status(400).json({ success: false, message: msg } satisfies ApiResponse);
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await questionService.deleteQuestion(Number(req.params.id));
    res.status(200).json({ success: true, message: "Question deleted." } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete question.";
    res.status(404).json({ success: false, message: msg } satisfies ApiResponse);
  }
};
