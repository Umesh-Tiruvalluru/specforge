import { Types } from "mongoose";
import {
  SpecModel,
  StoryModel,
  TaskModel,
  RiskModel,
  UnknownModel,
  MilestoneModel,
  ISpec,
} from "../models/spec";
import { AIOutput } from "../validator/aiOutputSchema";
import { SpecGenerateRequest } from "../validator/generateSchema";
import { NotFoundError } from "../lib/errors";

export interface ListSpecsOptions {
  page: number;
  limit: number;
  productType?: string;
}

export interface UpdateSpecPayload {
  title?: string;
  goal?: string;
  targetUser?: string;
  summary?: string;
  timelineConstraint?: string;
  budgetConstraint?: string;
  technicalConstraints?: string[];
  successCriteria?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toStringArray(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function createSpecFromAI(
  ai: AIOutput,
  input: SpecGenerateRequest,
): Promise<ISpec> {
  const newSpec = await SpecModel.create({
    title: ai.title,
    goal: ai.goal,
    targetUser: ai.targetUser,
    summary: ai.summary,
    productType: ai.productType,
    complexity: ai.complexity,
    estimatedTimeline: ai.estimatedTimeline,
    successCriteria: ai.successCriteria,
    technicalConstraints: toStringArray(input.technicalConstraints),
    timelineConstraint: input.timelineConstraint ?? "Not specified",
    budgetConstraint: input.budgetConstraint ?? "Not specified",
    stories: [],
    risks: [],
    unknowns: [],
    milestones: [],
  });

  // Stories + Tasks
  const storyIds: Types.ObjectId[] = [];
  for (let i = 0; i < ai.stories.length; i++) {
    const s = ai.stories[i];

    const story = await StoryModel.create({
      title: s.title,
      description: s.description,
      order: i,
      specId: newSpec._id,
      tasks: [],
    });

    const taskIds: Types.ObjectId[] = [];
    for (let j = 0; j < s.tasks.length; j++) {
      const task = await TaskModel.create({
        content: s.tasks[j],
        order: j,
        storyId: story._id,
      });
      taskIds.push(task._id);
    }

    await StoryModel.findByIdAndUpdate(story._id, { tasks: taskIds });
    storyIds.push(story._id);
  }

  // Risks
  const riskIds: Types.ObjectId[] = [];
  for (let i = 0; i < ai.risks.length; i++) {
    const risk = await RiskModel.create({
      content: ai.risks[i],
      order: i,
      specId: newSpec._id,
    });
    riskIds.push(risk._id);
  }

  // Unknowns
  const unknownIds: Types.ObjectId[] = [];
  for (let i = 0; i < ai.unknowns.length; i++) {
    const unknown = await UnknownModel.create({
      content: ai.unknowns[i],
      order: i,
      specId: newSpec._id,
    });
    unknownIds.push(unknown._id);
  }

  // Milestones
  const milestoneIds: Types.ObjectId[] = [];
  for (let i = 0; i < ai.milestones.length; i++) {
    const m = ai.milestones[i];
    const milestone = await MilestoneModel.create({
      title: m.title,
      description: m.description,
      order: i,
      specId: newSpec._id,
    });
    milestoneIds.push(milestone._id);
  }

  // Final spec update with all child IDs
  const updated = await SpecModel.findByIdAndUpdate(
    newSpec._id,
    {
      stories: storyIds,
      risks: riskIds,
      unknowns: unknownIds,
      milestones: milestoneIds,
    },
    { new: true },
  );

  return updated!;
}

export async function getSpecById(id: string): Promise<ISpec> {
  const spec = await SpecModel.findById(id)
    .populate({ path: "stories", populate: { path: "tasks" } })
    .populate("risks")
    .populate("unknowns")
    .populate("milestones")
    .lean();

  if (!spec) throw new NotFoundError("Spec");
  return spec as unknown as ISpec;
}

export async function listSpecs(options: ListSpecsOptions) {
  const { page, limit, productType } = options;

  const filter: Record<string, unknown> = {};
  if (productType) filter.productType = productType;

  const [specs, total] = await Promise.all([
    SpecModel.find(filter)
      .select(
        "_id title goal productType complexity estimatedTimeline createdAt",
      )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    SpecModel.countDocuments(filter),
  ]);

  return {
    specs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function updateSpec(
  id: string,
  payload: UpdateSpecPayload,
): Promise<ISpec> {
  const spec = await SpecModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!spec) throw new NotFoundError("Spec");
  return spec;
}

export async function deleteSpec(id: string): Promise<void> {
  const spec = await SpecModel.findById(id);
  if (!spec) throw new NotFoundError("Spec");

  await TaskModel.deleteMany({ storyId: { $in: spec.stories } });
  await StoryModel.deleteMany({ specId: id });
  await RiskModel.deleteMany({ specId: id });
  await UnknownModel.deleteMany({ specId: id });
  await MilestoneModel.deleteMany({ specId: id });
  await SpecModel.findByIdAndDelete(id);
}
