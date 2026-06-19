import { api } from "./api";
import { ApiResponse, AiEvaluationResult, EvaluateAnswerPayload } from "../types";

export const aiService = {
  async evaluate(payload: EvaluateAnswerPayload): Promise<AiEvaluationResult> {
    const { data } = await api.post<ApiResponse<AiEvaluationResult>>("/ai/evaluate", payload);
    return data.data!;
  },
};
