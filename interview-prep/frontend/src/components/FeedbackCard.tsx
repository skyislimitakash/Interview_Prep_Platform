import { CheckCircle2, TrendingUp } from "lucide-react";
import { AiEvaluationResult } from "../types";
import { Badge } from "./ui/Badge";

const scoreTone = (score: number): "good" | "warn" | "bad" => {
  if (score >= 7) return "good";
  if (score >= 4) return "warn";
  return "bad";
};

export const FeedbackCard = ({ result }: { result: AiEvaluationResult }) => {
  const tone = scoreTone(result.score);

  return (
    <div className="bg-ink-raised hairline rounded-2xl p-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-paper-muted font-medium tracking-wide">AI EVALUATION</span>
        <Badge tone={tone}>{result.score.toFixed(1)} / 10</Badge>
      </div>

      <p className="text-paper leading-relaxed mb-6">{result.feedback}</p>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-good shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-paper mb-1">Strengths</p>
            <p className="text-sm text-paper-muted leading-relaxed">{result.strengths}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <TrendingUp className="w-5 h-5 text-warn shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-paper mb-1">Areas to improve</p>
            <p className="text-sm text-paper-muted leading-relaxed">{result.improvements}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
