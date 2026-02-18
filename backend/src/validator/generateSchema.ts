import { z } from "zod";

export const specGenerateRequestSchema = z.object({
  title: z.string().min(3),
  goal: z.string().min(10),
  targetUsers: z.string().min(3),
  productType: z.string().min(2),

  successCriteria: z.string().optional(),
  technicalConstraints: z.string().optional(),
  timelineConstraint: z.string().optional(),
  budgetConstraint: z.string().optional(),
});

export type SpecGenerateRequest = z.infer<typeof specGenerateRequestSchema>;
