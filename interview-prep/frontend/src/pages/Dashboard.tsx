import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/ui/Spinner";
import { ScoreChart } from "../components/ScoreChart";
import { useAuth } from "../context/AuthContext";
import { topicService } from "../services/topic.service";
import { sessionService } from "../services/session.service";
import { Topic, Session } from "../types";
import { ArrowRight } from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [topicsData, historyData] = await Promise.all([
          topicService.getAll(),
          sessionService.getHistory(),
        ]);
        setTopics(topicsData);
        setSessions(historyData);
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
        <Spinner label="Loading your dashboard..." />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-paper mb-1">Welcome back, {user?.name.split(" ")[0]}</h1>
        <p className="text-paper-muted mb-10">Choose a topic to begin your next practice session.</p>

        {sessions.length > 0 && (
          <div className="bg-ink-raised hairline rounded-2xl p-6 mb-10">
            <h2 className="text-sm font-medium text-paper-muted mb-2 tracking-wide">SCORE TREND</h2>
            <ScoreChart sessions={sessions} />
          </div>
        )}

        <h2 className="text-sm font-medium text-paper-muted mb-4 tracking-wide">TOPICS</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => navigate(`/topics/${topic.id}`)}
              className="text-left bg-ink-raised hairline rounded-xl p-6 hover:border-accent/50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-paper">{topic.name}</h3>
                <ArrowRight className="w-4 h-4 text-paper-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </div>
              {topic.description && (
                <p className="text-sm text-paper-muted mt-2 leading-relaxed">{topic.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
