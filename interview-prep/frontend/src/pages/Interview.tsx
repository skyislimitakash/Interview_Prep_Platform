import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { QuestionCard } from "../components/QuestionCard";
import { FeedbackCard } from "../components/FeedbackCard";
import { TimerRing } from "../components/TimerRing";
import { useTimer } from "../hooks/useTimer";
import { questionService } from "../services/question.service";
import { sessionService } from "../services/session.service";
import { aiService } from "../services/ai.service";
import { Question, AiEvaluationResult } from "../types";
import { getErrorMessage } from "../services/api";

interface LocationState {
  questionCount?: number;
}

export const Interview = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { questionCount = 5 } = (location.state as LocationState) || {};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AiEvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState("");

  const timer = useTimer(true);

  // Topic comes from the URL's referring session — fetched via the session detail
  useEffect(() => {
    const load = async () => {
      try {
        const session = await sessionService.getDetail(Number(sessionId));
        const fetched = await questionService.getAll({
          topicId: session.topicId,
          limit: questionCount,
        });
        setQuestions(fetched);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [sessionId, questionCount]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSubmit = async () => {
    if (!currentQuestion || answer.trim().length < 10) {
      setError("Please write a more complete answer (at least 10 characters).");
      return;
    }
    setError("");
    setIsSubmitting(true);
    timer.pause();
    try {
      const evaluation = await aiService.evaluate({
        sessionId: Number(sessionId),
        questionId: currentQuestion.id,
        userAnswer: answer,
        timeTakenSec: timer.elapsedSeconds,
      });
      setResult(evaluation);
    } catch (err) {
      setError(getErrorMessage(err));
      timer.start();
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNext = useCallback(async () => {
    if (isLastQuestion) {
      setIsFinishing(true);
      try {
        await sessionService.end(Number(sessionId));
        navigate(`/results/${sessionId}`);
      } catch (err) {
        setError(getErrorMessage(err));
        setIsFinishing(false);
      }
      return;
    }
    setCurrentIndex((i) => i + 1);
    setAnswer("");
    setResult(null);
    timer.reset();
    timer.start();
  }, [isLastQuestion, navigate, sessionId, timer]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Spinner label="Preparing your questions..." />
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-20 text-center text-paper-muted">
          No questions available for this topic yet.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        >
          {!result ? (
            <>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here. Be specific — explain your reasoning, not just the conclusion."
                rows={8}
                disabled={isSubmitting}
                className="w-full bg-ink hairline rounded-xl p-4 text-paper placeholder:text-paper-muted/60 focus:border-accent transition-colors resize-none disabled:opacity-60"
              />

              {error && <p className="text-sm text-bad mt-3">{error}</p>}

              <div className="flex items-center justify-between mt-6">
                <TimerRing elapsedSeconds={timer.elapsedSeconds} />
                <Button onClick={handleSubmit} isLoading={isSubmitting}>
                  Submit answer
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-6">
              <FeedbackCard result={result} />
              <Button onClick={goToNext} isLoading={isFinishing} className="self-end">
                {isLastQuestion ? "Finish session" : "Next question"}
              </Button>
            </div>
          )}
        </QuestionCard>
      </div>
    </>
  );
};
