import { Session, Answer, Topic, Question } from "../models";
import { StartSessionDto } from "../types";
import { Op } from "sequelize";

export const startSession = async (userId: number, dto: StartSessionDto) => {
  // Abandon any previous in-progress sessions for the same user & topic
  await Session.update(
    { status: "abandoned", endedAt: new Date() },
    {
      where: {
        userId,
        topicId: dto.topicId,
        status: "in_progress",
      },
    }
  );

  return Session.create({
    userId,
    topicId: dto.topicId,
    totalQuestions: dto.totalQuestions,
    answered: 0,
    status: "in_progress",
  });
};

export const endSession = async (sessionId: number, userId: number) => {
  const session = await Session.findOne({ where: { id: sessionId, userId } });
  if (!session) throw new Error("Session not found.");
  if (session.status !== "in_progress") throw new Error("Session is already ended.");

  // Calculate average score from all answers in this session
  const answers = await Answer.findAll({ where: { sessionId } });

  let avgScore: number | null = null;
  if (answers.length > 0) {
    const scored = answers.filter((a) => a.aiScore !== null);
    if (scored.length > 0) {
      const total = scored.reduce((sum, a) => sum + Number(a.aiScore), 0);
      avgScore = parseFloat((total / scored.length).toFixed(2));
    }
  }

  return session.update({
    status: "completed",
    endedAt: new Date(),
    avgScore,
    answered: answers.length,
  });
};

export const getSessionHistory = async (userId: number) => {
  return Session.findAll({
    where: { userId, status: { [Op.ne]: "in_progress" } },
    include: [{ model: Topic, as: "topic", attributes: ["id", "name", "icon"] }],
    order: [["startedAt", "DESC"]],
  });
};

export const getSessionDetail = async (sessionId: number, userId: number) => {
  const session = await Session.findOne({
    where: { id: sessionId, userId },
    include: [
      { model: Topic, as: "topic" },
      {
        model: Answer,
        as: "answers",
        include: [
          {
            model: Question,
            as: "question",
            attributes: ["id", "questionText", "difficulty", "type"],
          },
        ],
      },
    ],
  });
  if (!session) throw new Error("Session not found.");
  return session;
};
