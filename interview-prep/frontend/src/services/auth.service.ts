import { api } from "./api";
import { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, User } from "../types";

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    return data.data!;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return data.data!;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    return data.data!;
  },
};
