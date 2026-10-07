import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

// ClerkProvider attaches a `Clerk` instance to window once loaded — this is
// the documented pattern for attaching auth to a plain axios instance that
// lives outside the React tree. Tokens are short-lived (~60s) and
// auto-refreshed by Clerk, so we fetch a fresh one on every request rather
// than caching it.
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

api.interceptors.request.use(async (config) => {
  const token = await window.Clerk?.session?.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});