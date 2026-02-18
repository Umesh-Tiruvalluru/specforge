import { Request, Response, NextFunction } from "express";
import { generateSpecFromAI } from "../services/aiService";
import {
  createSpecFromAI,
  getSpecById,
  listSpecs,
  updateSpec,
  deleteSpec,
} from "../services/specService";
import { sendSuccess } from "../lib/response";
import { SpecGenerateRequest } from "../validator/generateSchema";
import { UpdateSpecRequest, ListSpecsQuery } from "../validator/specSchema";

// POST /api/generate
export async function generateSpec(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = req.validated.body as SpecGenerateRequest;
    const aiOutput = await generateSpecFromAI(input);
    const spec = await createSpecFromAI(aiOutput, input);
    sendSuccess(res, { specId: spec._id }, 201);
  } catch (err) {
    next(err);
  }
}

// GET /api/specs
export async function getSpecs(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = req.validated.query as ListSpecsQuery;
    const result = await listSpecs({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      productType: query.productType,
    });
    sendSuccess(res, result.specs, 200, { pagination: result.pagination });
  } catch (err) {
    next(err);
  }
}

// GET /api/specs/:id
export async function getSpec(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.validated.params as { id: string };
    sendSuccess(res, await getSpecById(id));
  } catch (err) {
    next(err);
  }
}

// PATCH /api/specs/:id
export async function patchSpec(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.validated.params as { id: string };
    const payload = req.validated.body as UpdateSpecRequest;
    sendSuccess(res, await updateSpec(id, payload));
  } catch (err) {
    next(err);
  }
}

// DELETE /api/specs/:id
export async function removeSpec(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.validated.params as { id: string };
    await deleteSpec(id);
    sendSuccess(res, { deleted: true });
  } catch (err) {
    next(err);
  }
}
