import { Question, Topic } from "../models";
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionFilter,
} from "../types";

export const getAllQuestions = async (filter: QuestionFilter) => {
  const where: Record<string, unknown> = { isActive: true };
  if (filter.topicId)   where.topicId   = filter.topicId;
  if (filter.difficulty) where.difficulty = filter.difficulty;
  if (filter.type)       where.type       = filter.type;

  return Question.findAll({
    where,
    include: [{ model: Topic, as: "topic", attributes: ["id", "name", "icon"] }],
    limit: filter.limit || 10,
    order: [["id", "ASC"]],
  });
};

export const getQuestionById = async (id: number) => {
  const q = await Question.findByPk(id, {
    include: [{ model: Topic, as: "topic" }],
  });
  if (!q) throw new Error("Question not found.");
  return q;
};

export const createQuestion = async (dto: CreateQuestionDto) => {
  const topic = await Topic.findByPk(dto.topicId);
  if (!topic) throw new Error("Topic not found.");
  return Question.create({ ...dto });
};

export const updateQuestion = async (id: number, dto: UpdateQuestionDto) => {
  const q = await Question.findByPk(id);
  if (!q) throw new Error("Question not found.");
  return q.update(dto);
};

export const deleteQuestion = async (id: number) => {
  const q = await Question.findByPk(id);
  if (!q) throw new Error("Question not found.");
  await q.update({ isActive: false }); // soft delete
};
