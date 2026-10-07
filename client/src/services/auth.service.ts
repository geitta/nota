import { api } from "./api";
import type { AuthResponse } from "../types";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const signup = (payload: SignupPayload): Promise<AuthResponse> =>
  api.post<AuthResponse>("/auth/signup", payload).then((r) => r.data);

export const login = (payload: LoginPayload): Promise<AuthResponse> =>
  api.post<AuthResponse>("/auth/login", payload).then((r) => r.data);