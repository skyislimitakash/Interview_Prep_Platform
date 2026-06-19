import { useEffect, useState, FormEvent } from "react";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/Badge";
import { topicService } from "../services/topic.service";
import { questionService } from "../services/question.service";
import { Topic, Question, QuestionType, DifficultyLevel } from "../types";
import { getErrorMessage } from "../services/api";
import { Plus, Trash2, X } from "lucide-react";

const TYPES: QuestionType[] = ["technical", "hr", "behavioral"];
const DIFFICULTIES: DifficultyLevel[] = ["easy", "medium", "hard"];

const emptyForm = {
  topicId: 0,
  questionText: "",
  type: "technical" as QuestionType,
  difficulty: "medium" as DifficultyLevel,
  sampleAnswer: "",
};

export const Admin = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAll = async () => {
    const [topicsData, questionsData] = await Promise.all([
      topicService.getAll(),
      questionService.getAll({ limit: 100 }),
    ]);
    setTopics(topicsData);
    setQuestions(questionsData);
    if (topicsData.length > 0 && form.topicId === 0) {
      setForm((f) => ({ ...f, topicId: topicsData[0].id }));
    }
  };

  useEffect(() => {
    loadAll().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      await questionService.create(form);
      setForm({ ...emptyForm, topicId: form.topicId });
      setShowForm(false);
      await loadAll();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    await questionService.remove(id);
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Spinner label="Loading admin panel..." />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl text-paper mb-1">Question bank</h1>
            <p className="text-paper-muted">{questions.length} active questions</p>
          </div>
          <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? "secondary" : "primary"}>
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Add question"}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-ink-raised hairline rounded-2xl p-6 mb-8 flex flex-col gap-4">
            <div>
              <label className="text-sm text-paper-muted mb-1.5 block">Topic</label>
              <select
                value={form.topicId}
                onChange={(e) => setForm({ ...form, topicId: Number(e.target.value) })}
                className="w-full bg-ink hairline rounded-lg px-4 py-2.5 text-paper focus:border-accent transition-colors"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-paper-muted mb-1.5 block">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as QuestionType })}
                  className="w-full bg-ink hairline rounded-lg px-4 py-2.5 text-paper focus:border-accent transition-colors capitalize"
                >
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-paper-muted mb-1.5 block">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value as DifficultyLevel })}
                  className="w-full bg-ink hairline rounded-lg px-4 py-2.5 text-paper focus:border-accent transition-colors capitalize"
                >
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <Input
              label="Question text"
              value={form.questionText}
              onChange={(e) => setForm({ ...form, questionText: e.target.value })}
              required
            />

            <div>
              <label className="text-sm text-paper-muted mb-1.5 block">Sample / ideal answer</label>
              <textarea
                value={form.sampleAnswer}
                onChange={(e) => setForm({ ...form, sampleAnswer: e.target.value })}
                rows={4}
                required
                className="w-full bg-ink hairline rounded-lg px-4 py-2.5 text-paper placeholder:text-paper-muted/60 focus:border-accent transition-colors resize-none"
                placeholder="This is used by the AI to evaluate user answers — be thorough."
              />
            </div>

            {error && <p className="text-sm text-bad">{error}</p>}

            <Button type="submit" isLoading={isSaving} className="self-start">
              Save question
            </Button>
          </form>
        )}

        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <div key={q.id} className="bg-ink-raised hairline rounded-xl p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <Badge tone="neutral">{q.topic?.name}</Badge>
                  <Badge tone="neutral">{q.difficulty}</Badge>
                </div>
                <p className="text-sm text-paper leading-relaxed">{q.questionText}</p>
              </div>
              <button
                onClick={() => handleDelete(q.id)}
                className="text-paper-muted hover:text-bad transition-colors p-1"
                aria-label="Delete question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
