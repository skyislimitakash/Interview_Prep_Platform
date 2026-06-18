import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as authService from "../services/auth.service";
import { AuthRequest, ApiResponse } from "../types";

export const register = async (req: Request, res: Response): Promise<void> => {
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
    const data = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data,
    } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Registration failed.";
    res.status(400).json({ success: false, message: msg } satisfies ApiResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
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
    const data = await authService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      data,
    } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Login failed.";
    res.status(401).json({ success: false, message: msg } satisfies ApiResponse);
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await authService.getMe(req.user!.id);
    res.status(200).json({ success: true, message: "User fetched.", data } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch user.";
    res.status(404).json({ success: false, message: msg } satisfies ApiResponse);
  }
};
