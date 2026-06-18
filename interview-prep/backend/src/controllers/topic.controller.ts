import { Response } from "express";
import { Topic } from "../models";
import { AuthRequest, ApiResponse } from "../types";

export const getAllTopics = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const topics = await Topic.findAll({ where: { isActive: true }, order: [["name", "ASC"]] });
    res.status(200).json({ success: true, message: "Topics fetched.", data: topics } satisfies ApiResponse);
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch topics." } satisfies ApiResponse);
  }
};

export const createTopic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json({ success: true, message: "Topic created.", data: topic } satisfies ApiResponse);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create topic.";
    res.status(400).json({ success: false, message: msg } satisfies ApiResponse);
  }
};
