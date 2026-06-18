import { Request } from "express";

// ─── Auth ───────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin";

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

// Express Request extended with the authenticated user
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── API Response Envelope ──────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// ─── Auth DTOs ──────────────────────────────────────────────────────────────

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

// ─── Question DTOs ──────────────────────────────────────────────────────────

export type QuestionType = "technical" | "hr" | "behavioral";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface CreateQuestionDto {
  topicId: number;
  questionText: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  sampleAnswer: string;
}

export interface UpdateQuestionDto extends Partial<CreateQuestionDto> {}

export interface QuestionFilter {
  topicId?: number;
  difficulty?: DifficultyLevel;
  type?: QuestionType;
  limit?: number;
}

// ─── Session DTOs ───────────────────────────────────────────────────────────

export type SessionStatus = "in_progress" | "completed" | "abandoned";

export interface StartSessionDto {
  topicId: number;
  totalQuestions: number;
}

export interface EndSessionDto {
  sessionId: number;
}

// ─── AI DTOs ────────────────────────────────────────────────────────────────

export interface EvaluateAnswerDto {
  sessionId: number;
  questionId: number;
  userAnswer: string;
  timeTakenSec?: number;
}

export interface AiEvaluationResult {
  score: number;          // 0–10
  feedback: string;       // overall paragraph
  strengths: string;      // what was done well
  improvements: string;   // what to improve
}

// ─── Topic DTOs ─────────────────────────────────────────────────────────────

export interface CreateTopicDto {
  name: string;
  description?: string;
  icon?: string;
}
