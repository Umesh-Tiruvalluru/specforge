import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors";
import { sendError } from "../lib/response";
import mongoose from "mongoose";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    sendError(res, "Validation failed", 400, messages);
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    sendError(res, `Invalid value for field: ${err.path}`, 400);
    return;
  }

  if ((err as NodeJS.ErrnoException).name === "MongoServerError") {
    const mongoErr = err as unknown as {
      code: number;
      keyValue: Record<string, unknown>;
    };
    if (mongoErr.code === 11000) {
      sendError(res, "Duplicate key error", 409, mongoErr.keyValue);
      return;
    }
  }

  console.error("[Unhandled Error]", err);
  sendError(res, "Internal server error", 500);
}
