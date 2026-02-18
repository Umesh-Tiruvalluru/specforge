import { z } from "zod";

export const aiOutputSchema = z.object({
  title: z.string(),
  goal: z.string(),
  targetUser: z.string(),
  summary: z.string(),
  productType: z.string(),
  complexity: z.string(),
  estimatedTimeline: z.string(),
  successCriteria: z.array(z.string()),
  stories: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      tasks: z.array(z.string()),
    }),
  ),
  risks: z.array(z.string()),
  unknowns: z.array(z.string()),
  milestones: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    }),
  ),
});

export type AIOutput = z.infer<typeof aiOutputSchema>;
