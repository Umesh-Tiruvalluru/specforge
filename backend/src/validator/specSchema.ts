import { z } from "zod";

export const listSpecsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  productType: z.string().optional(),
});
export type ListSpecsQuery = z.infer<typeof listSpecsQuerySchema>;

export const updateSpecBodySchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    goal: z.string().min(10).optional(),
    targetUser: z.string().min(3).optional(),
    summary: z.string().optional(),
    timelineConstraint: z.string().optional(),
    budgetConstraint: z.string().optional(),
    technicalConstraints: z.array(z.string()).optional(),
    successCriteria: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
export type UpdateSpecRequest = z.infer<typeof updateSpecBodySchema>;

export const specIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid spec ID"),
});
