import { api } from "./api";
import { ApiResponse, Question, CreateQuestionPayload, DifficultyLevel, QuestionType } from "../types";

export interface QuestionFilters {
  topicId?: number;
  difficulty?: DifficultyLevel;
  type?: QuestionType;
  limit?: number;
}

export const questionService = {
  async getAll(filters: QuestionFilters = {}): Promise<Question[]> {
    const { data } = await api.get<ApiResponse<Question[]>>("/questions", { params: filters });
    return data.data!;
  },

  async getById(id: number): Promise<Question> {
    const { data } = await api.get<ApiResponse<Question>>(`/questions/${id}`);
    return data.data!;
  },

  async create(payload: CreateQuestionPayload): Promise<Question> {
    const { data } = await api.post<ApiResponse<Question>>("/questions", payload);
    return data.data!;
  },

  async update(id: number, payload: Partial<CreateQuestionPayload>): Promise<Question> {
    const { data } = await api.put<ApiResponse<Question>>(`/questions/${id}`, payload);
    return data.data!;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/questions/${id}`);
  },
};
