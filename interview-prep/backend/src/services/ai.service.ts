import OpenAI from "openai";
import { env } from "../config/env";
import { Question, Answer, Session } from "../models";
import { EvaluateAnswerDto, AiEvaluationResult } from "../types";

const openai = new OpenAI({ apiKey: env.openai.apiKey });

// Build a structured prompt that instructs the model to evaluate strictly as JSON
const buildEvaluationPrompt = (
  questionText: string,
  sampleAnswer: string,
  userAnswer: string
): string => `
You are a strict but fair technical interview evaluator.

Evaluate the candidate's answer to the interview question below.
Return ONLY a valid JSON object — no markdown, no explanation outside the JSON.

Question:
"""
${questionText}
"""

Ideal Answer (for reference):
"""
${sampleAnswer}
"""

Candidate's Answer:
"""
${userAnswer}
"""

Respond with this exact JSON structure:
{
  "score": <number between 0 and 10, one decimal place allowed>,
  "feedback": "<2–4 sentence overall evaluation of the answer>",
  "strengths": "<what the candidate did well, 1–3 bullet points as a single string>",
  "improvements": "<specific areas to improve, 1–3 bullet points as a single string>"
}
`;

const callOpenAI = async (prompt: string): Promise<AiEvaluationResult> => {
  const response = await openai.chat.completions.create({
    model: env.openai.model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,       // low temperature = consistent, predictable scoring
    max_tokens: 600,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("No response received from AI.");

  const parsed = JSON.parse(raw) as AiEvaluationResult;

  // Clamp score between 0 and 10 defensively
  parsed.score = Math.min(10, Math.max(0, Number(parsed.score)));
  return parsed;
};

export const evaluateAnswer = async (
  userId: number,
  dto: EvaluateAnswerDto
): Promise<AiEvaluationResult> => {
  // Validate session belongs to user
  const session = await Session.findOne({
    where: { id: dto.sessionId, userId, status: "in_progress" },
  });
  if (!session) throw new Error("Active session not found.");

  // Load the question (includes sample answer for the prompt)
  const question = await Question.findByPk(dto.questionId);
  if (!question) throw new Error("Question not found.");

  const prompt = buildEvaluationPrompt(
    question.questionText,
    question.sampleAnswer,
    dto.userAnswer
  );

  const result = await callOpenAI(prompt);

  // Persist the answer with AI feedback
  await Answer.create({
    sessionId: dto.sessionId,
    questionId: dto.questionId,
    userId,
    userAnswer: dto.userAnswer,
    aiScore: result.score,
    aiFeedback: result.feedback,
    aiStrengths: result.strengths,
    aiImprovements: result.improvements,
    timeTakenSec: dto.timeTakenSec ?? null,
  });

  // Increment answered count on the session
  await session.update({ answered: session.answered + 1 });

  return result;
};
