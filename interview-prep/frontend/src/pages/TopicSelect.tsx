import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { topicService } from "../services/topic.service";
import { sessionService } from "../services/session.service";
import { Topic } from "../types";
import { getErrorMessage } from "../services/api";

const QUESTION_COUNT_OPTIONS = [3, 5, 10];

export const TopicSelect = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const topics = await topicService.getAll();
        const found = topics.find((t) => t.id === Number(topicId));
        setTopic(found || null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [topicId]);

  const handleStart = async () => {
    if (!topic) return;
    setIsStarting(true);
    setError("");
    try {
      const session = await sessionService.start(topic.id, questionCount);
      navigate(`/interview/${session.id}`, { state: { questionCount } });
    } catch (err) {
      setError(getErrorMessage(err));
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Spinner label="Loading topic..." />
      </>
    );
  }

  if (!topic) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20 text-center text-paper-muted">
          Topic not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-display text-3xl text-paper mb-2">{topic.name}</h1>
        {topic.description && <p className="text-paper-muted mb-10 leading-relaxed">{topic.description}</p>}

        <div className="bg-ink-raised hairline rounded-2xl p-8">
          <p className="text-sm font-medium text-paper-muted mb-4 tracking-wide">HOW MANY QUESTIONS?</p>
          <div className="flex gap-3 mb-8">
            {QUESTION_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors hairline ${
                  questionCount === count
                    ? "bg-accent text-white border-accent"
                    : "text-paper-muted hover:text-paper"
                }`}
              >
                {count}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-bad mb-4">{error}</p>}

          <Button onClick={handleStart} isLoading={isStarting} className="w-full">
            Start session
          </Button>
        </div>
      </div>
    </>
  );
};
