import { Response } from "express";
import * as sessionService from "../services/session.service";
import { AuthRequest, ApiResponse } from "../types";

export const startSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await sessionService.startSession(req.user!.id, req.body);
    res.status(201).json({ success: true, message: "Session started.", data } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to start session.";
    res.status(400).json({ success: false, message: msg } satisfies ApiResponse);
  }
};

export const endSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await sessionService.endSession(Number(req.params.id), req.user!.id);
    res.status(200).json({ success: true, message: "Session completed.", data } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to end session.";
    res.status(400).json({ success: false, message: msg } satisfies ApiResponse);
  }
};

export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await sessionService.getSessionHistory(req.user!.id);
    res.status(200).json({ success: true, message: "History fetched.", data } satisfies ApiResponse);
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch history." } satisfies ApiResponse);
  }
};

export const getSessionDetail = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await sessionService.getSessionDetail(
      Number(req.params.id),
      req.user!.id
    );
    res.status(200).json({ success: true, message: "Session fetched.", data } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Session not found.";
    res.status(404).json({ success: false, message: msg } satisfies ApiResponse);
  }
};
