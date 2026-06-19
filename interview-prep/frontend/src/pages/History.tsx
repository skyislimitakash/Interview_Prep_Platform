import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/ui/Spinner";
import { Badge } from "../components/ui/Badge";
import { sessionService } from "../services/session.service";
import { Session } from "../types";
import { Calendar } from "lucide-react";

const scoreTone = (score: number | null): "good" | "warn" | "bad" | "neutral" => {
  if (score === null) return "neutral";
  if (score >= 7) return "good";
  if (score >= 4) return "warn";
  return "bad";
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const History = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await sessionService.getHistory();
        setSessions(data);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Spinner label="Loading your history..." />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-paper mb-1">Session history</h1>
        <p className="text-paper-muted mb-10">Every practice session you've completed.</p>

        {sessions.length === 0 ? (
          <div className="bg-ink-raised hairline rounded-2xl p-12 text-center">
            <Calendar className="w-8 h-8 text-paper-muted mx-auto mb-3" />
            <p className="text-paper-muted">No sessions yet. Start one from your dashboard.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => navigate(`/results/${session.id}`)}
                className="text-left bg-ink-raised hairline rounded-xl p-5 flex items-center justify-between hover:border-accent/50 transition-colors"
              >
                <div>
                  <p className="font-display text-lg text-paper">{session.topic?.name || "Topic"}</p>
                  <p className="text-sm text-paper-muted mt-1">
                    {formatDate(session.startedAt)} · {session.answered} questions
                  </p>
                </div>
                <Badge tone={scoreTone(session.avgScore)}>
                  {session.avgScore !== null ? session.avgScore.toFixed(1) : "—"}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
