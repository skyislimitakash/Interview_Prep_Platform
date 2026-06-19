// ─── Auth ───────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Topics ─────────────────────────────────────────────────────────────────

export interface Topic {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
}

// ─── Questions ──────────────────────────────────────────────────────────────

export type QuestionType = "technical" | "hr" | "behavioral";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  topicId: number;
  questionText: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  sampleAnswer: string;
  topic?: Topic;
}

export interface CreateQuestionPayload {
  topicId: number;
  questionText: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  sampleAnswer: string;
}

// ─── Sessions ───────────────────────────────────────────────────────────────

export type SessionStatus = "in_progress" | "completed" | "abandoned";

export interface Session {
  id: number;
  userId: number;
  topicId: number;
  totalQuestions: number;
  answered: number;
  avgScore: number | null;
  status: SessionStatus;
  startedAt: string;
  endedAt: string | null;
  topic?: Topic;
  answers?: Answer[];
}

// ─── Answers ────────────────────────────────────────────────────────────────

export interface Answer {
  id: number;
  sessionId: number;
  questionId: number;
  userAnswer: string;
  aiScore: number | null;
  aiFeedback: string | null;
  aiStrengths: string | null;
  aiImprovements: string | null;
  timeTakenSec: number | null;
  answeredAt: string;
  question?: Pick<Question, "id" | "questionText" | "difficulty" | "type">;
}

export interface EvaluateAnswerPayload {
  sessionId: number;
  questionId: number;
  userAnswer: string;
  timeTakenSec?: number;
}

export interface AiEvaluationResult {
  score: number;
  feedback: string;
  strengths: string;
  improvements: string;
}

// ─── API Envelope ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
