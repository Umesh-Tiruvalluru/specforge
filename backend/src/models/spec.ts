import mongoose, { Document, Schema, Model, Types } from "mongoose";

export const PRODUCT_TYPES = [
  "web-app",
  "mobile-app",
  "api",
  "desktop-app",
  "cli",
  "saas",
  "other",
] as const;
export const COMPLEXITY_LEVELS = [
  "low",
  "medium",
  "high",
  "very-high",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];
export type ComplexityLevel = (typeof COMPLEXITY_LEVELS)[number];

export interface ISpec extends Document {
  _id: Types.ObjectId;
  title: string;
  goal: string;
  targetUser: string;
  summary: string;
  productType: string;
  complexity: string;
  estimatedTimeline: string;
  successCriteria: string[];
  technicalConstraints: string[];
  timelineConstraint: string;
  budgetConstraint: string;
  stories: Types.ObjectId[];
  risks: Types.ObjectId[];
  unknowns: Types.ObjectId[];
  milestones: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IStory extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  order: number;
  specId: Types.ObjectId;
  tasks: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask extends Document {
  _id: Types.ObjectId;
  content: string;
  order: number;
  storyId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRisk extends Document {
  _id: Types.ObjectId;
  content: string;
  order: number;
  specId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUnknown extends Document {
  _id: Types.ObjectId;
  content: string;
  order: number;
  specId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMilestone extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  order: number;
  specId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SpecSchema = new Schema<ISpec>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    goal: {
      type: String,
      required: [true, "Goal is required"],
      trim: true,
      minlength: [10, "Goal must be at least 10 characters"],
    },
    targetUser: {
      type: String,
      required: [true, "Target user is required"],
      trim: true,
      minlength: [3, "Target user must be at least 3 characters"],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
    },
    productType: {
      type: String,
      required: [true, "Product type is required"],
      trim: true,
    },
    complexity: {
      type: String,
      required: [true, "Complexity is required"],
      trim: true,
    },
    estimatedTimeline: {
      type: String,
      required: [true, "Estimated timeline is required"],
      trim: true,
    },
    successCriteria: { type: [{ type: String, trim: true }], default: [] },
    technicalConstraints: { type: [{ type: String, trim: true }], default: [] },
    timelineConstraint: {
      type: String,
      required: [true, "Timeline constraint is required"],
      trim: true,
      default: "Not specified",
    },
    budgetConstraint: {
      type: String,
      required: [true, "Budget constraint is required"],
      trim: true,
      default: "Not specified",
    },
    stories: [{ type: Schema.Types.ObjectId, ref: "Story" }],
    risks: [{ type: Schema.Types.ObjectId, ref: "Risk" }],
    unknowns: [{ type: Schema.Types.ObjectId, ref: "Unknown" }],
    milestones: [{ type: Schema.Types.ObjectId, ref: "Milestone" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

SpecSchema.index({ createdAt: -1 });
SpecSchema.index({ title: "text", goal: "text" }); // full-text search
SpecSchema.index({ productType: 1 });

const StorySchema = new Schema<IStory>(
  {
    title: {
      type: String,
      required: [true, "Story title is required"],
      trim: true,
      maxlength: [300, "Story title cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Story description is required"],
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: [0, "Order must be non-negative"],
    },
    specId: {
      type: Schema.Types.ObjectId,
      ref: "Spec",
      required: [true, "Spec ID is required"],
      index: true,
    },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true },
);
StorySchema.index({ specId: 1, order: 1 });

const TaskSchema = new Schema<ITask>(
  {
    content: {
      type: String,
      required: [true, "Task content is required"],
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: [0, "Order must be non-negative"],
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: [true, "Story ID is required"],
      index: true,
    },
  },
  { timestamps: true },
);
TaskSchema.index({ storyId: 1, order: 1 });

const RiskSchema = new Schema<IRisk>(
  {
    content: {
      type: String,
      required: [true, "Risk content is required"],
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: [0, "Order must be non-negative"],
    },
    specId: {
      type: Schema.Types.ObjectId,
      ref: "Spec",
      required: [true, "Spec ID is required"],
      index: true,
    },
  },
  { timestamps: true },
);

const UnknownSchema = new Schema<IUnknown>(
  {
    content: {
      type: String,
      required: [true, "Unknown content is required"],
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: [0, "Order must be non-negative"],
    },
    specId: {
      type: Schema.Types.ObjectId,
      ref: "Spec",
      required: [true, "Spec ID is required"],
      index: true,
    },
  },
  { timestamps: true },
);

const MilestoneSchema = new Schema<IMilestone>(
  {
    title: {
      type: String,
      required: [true, "Milestone title is required"],
      trim: true,
      maxlength: [300, "Milestone title cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Milestone description is required"],
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: [0, "Order must be non-negative"],
    },
    specId: {
      type: Schema.Types.ObjectId,
      ref: "Spec",
      required: [true, "Spec ID is required"],
      index: true,
    },
  },
  { timestamps: true },
);

export const SpecModel: Model<ISpec> = mongoose.model("Spec", SpecSchema);
export const StoryModel: Model<IStory> = mongoose.model("Story", StorySchema);
export const TaskModel: Model<ITask> = mongoose.model("Task", TaskSchema);
export const RiskModel: Model<IRisk> = mongoose.model("Risk", RiskSchema);
export const UnknownModel: Model<IUnknown> = mongoose.model(
  "Unknown",
  UnknownSchema,
);
export const MilestoneModel: Model<IMilestone> = mongoose.model(
  "Milestone",
  MilestoneSchema,
);
