import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { sessionService } from "../services/session.service";
import { Session } from "../types";

const scoreTone = (score: number): "good" | "warn" | "bad" => {
  if (score >= 7) return "good";
  if (score >= 4) return "warn";
  return "bad";
};

export const Results = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sessionService.getDetail(Number(sessionId));
        setSession(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [sessionId]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Spinner label="Calculating your results..." />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20 text-center text-paper-muted">Session not found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-sm text-paper-muted tracking-wide mb-2">SESSION COMPLETE</p>
          <h1 className="font-display text-4xl text-paper mb-3">
            {session.avgScore !== null ? session.avgScore.toFixed(1) : "—"}{" "}
            <span className="text-2xl text-paper-muted">/ 10</span>
          </h1>
          <p className="text-paper-muted">
            {session.answered} of {session.totalQuestions} questions answered · {session.topic?.name}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-10">
          {session.answers?.map((a, idx) => (
            <div key={a.id} className="bg-ink-raised hairline rounded-xl p-5 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-paper-muted mb-1">Question {idx + 1}</p>
                <p className="text-sm text-paper leading-relaxed">{a.question?.questionText}</p>
              </div>
              {a.aiScore !== null && <Badge tone={scoreTone(a.aiScore)}>{a.aiScore.toFixed(1)}</Badge>}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => navigate("/history")}>
            View history
          </Button>
          <Button onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
        </div>
      </div>
    </>
  );
};
