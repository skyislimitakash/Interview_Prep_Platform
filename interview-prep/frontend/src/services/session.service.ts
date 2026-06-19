import { api } from "./api";
import { ApiResponse, Session } from "../types";

export const sessionService = {
  async start(topicId: number, totalQuestions: number): Promise<Session> {
    const { data } = await api.post<ApiResponse<Session>>("/sessions/start", {
      topicId,
      totalQuestions,
    });
    return data.data!;
  },

  async end(sessionId: number): Promise<Session> {
    const { data } = await api.patch<ApiResponse<Session>>(`/sessions/${sessionId}/end`);
    return data.data!;
  },

  async getHistory(): Promise<Session[]> {
    const { data } = await api.get<ApiResponse<Session[]>>("/sessions/history");
    return data.data!;
  },

  async getDetail(sessionId: number): Promise<Session> {
    const { data } = await api.get<ApiResponse<Session>>(`/sessions/${sessionId}`);
    return data.data!;
  },
};
