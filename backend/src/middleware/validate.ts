import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../lib/response";

type Target = "body" | "params" | "query";

// Augment Express Request to carry validated/coerced data
declare global {
  namespace Express {
    interface Request {
      validated: {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };
    }
  }
}

/**
 * Validates req[target] against a Zod schema.
 * Coerced/parsed result is stored on req.validated[target] instead of
 * overwriting req.query / req.params which are read-only in Express 5.
 */
export function validate<T>(schema: ZodSchema<T>, target: Target = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.validated) req.validated = {};

    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const formatted = (result.error as ZodError).issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      sendError(res, "Validation failed", 400, formatted);
      return;
    }

    req.validated[target] = result.data;
    next();
  };
}
