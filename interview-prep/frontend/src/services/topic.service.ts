import { api } from "./api";
import { ApiResponse, Topic } from "../types";

export const topicService = {
  async getAll(): Promise<Topic[]> {
    const { data } = await api.get<ApiResponse<Topic[]>>("/topics");
    return data.data!;
  },
};
