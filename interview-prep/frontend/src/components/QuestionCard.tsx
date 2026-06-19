import { ReactNode } from "react";
import { Badge } from "./ui/Badge";
import { Question } from "../types";

const difficultyTone: Record<string, "good" | "warn" | "bad"> = {
  easy: "good",
  medium: "warn",
  hard: "bad",
};

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  children?: ReactNode;
}

export const QuestionCard = ({ question, questionNumber, totalQuestions, children }: QuestionCardProps) => {
  return (
    <div className="relative">
      {/* Spotlight glow behind the card — the signature visual treatment */}
      <div className="absolute inset-x-12 -top-8 h-32 bg-accent/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative bg-ink-raised hairline rounded-2xl p-8 shadow-spotlight">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-paper-muted font-medium tracking-wide">
            QUESTION {questionNumber} OF {totalQuestions}
          </span>
          <div className="flex gap-2">
            <Badge tone={difficultyTone[question.difficulty]}>{question.difficulty}</Badge>
            <Badge tone="neutral">{question.type}</Badge>
          </div>
        </div>

        <h2 className="font-display text-2xl leading-snug text-paper mb-8">
          {question.questionText}
        </h2>

        {children}
      </div>
    </div>
  );
};
