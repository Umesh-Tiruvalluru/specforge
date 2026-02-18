export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: { field: string; message: string }[];
  meta?: { pagination?: Pagination };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Task {
  _id: string;
  content: string;
  order: number;
  storyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  _id: string;
  title: string;
  description: string;
  order: number;
  specId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Risk {
  _id: string;
  content: string;
  order: number;
  specId: string;
}

export interface Unknown {
  _id: string;
  content: string;
  order: number;
  specId: string;
}

export interface Milestone {
  _id: string;
  title: string;
  description: string;
  order: number;
  specId: string;
}

export interface Spec {
  _id: string;
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
  stories: Story[];
  risks: Risk[];
  unknowns: Unknown[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface SpecListItem {
  _id: string;
  title: string;
  goal: string;
  productType: string;
  complexity: string;
  estimatedTimeline: string;
  createdAt: string;
}

export interface GeneratePayload {
  title: string;
  goal: string;
  targetUsers: string;
  productType: string;
  successCriteria?: string;
  technicalConstraints?: string;
  timelineConstraint?: string;
  budgetConstraint?: string;
}

export interface Template {
  name: string;
  description: string;
  defaults: Partial<GeneratePayload>;
}
