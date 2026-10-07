import type { Request, Response, NextFunction } from "express";

interface HttpError extends Error {
  status?: number;
}

export function errorMiddleware(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Something went wrong." });
}
