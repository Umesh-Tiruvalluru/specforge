import type { Spec } from "./types";

export function specToMarkdown(spec: Spec): string {
  const lines: string[] = [];

  lines.push(`# ${spec.title}`);
  lines.push("");
  lines.push(`> ${spec.summary}`);
  lines.push("");
  lines.push(`**Product Type:** ${spec.productType} | **Complexity:** ${spec.complexity} | **Timeline:** ${spec.estimatedTimeline}`);
  lines.push("");

  lines.push("## Overview");
  lines.push("");
  lines.push(`**Goal:** ${spec.goal}`);
  lines.push("");
  lines.push(`**Target Users:** ${spec.targetUser}`);
  lines.push("");

  if (spec.timelineConstraint) {
    lines.push(`**Timeline Constraint:** ${spec.timelineConstraint}`);
    lines.push("");
  }
  if (spec.budgetConstraint) {
    lines.push(`**Budget Constraint:** ${spec.budgetConstraint}`);
    lines.push("");
  }

  if (spec.successCriteria?.length) {
    lines.push("## Success Criteria");
    lines.push("");
    spec.successCriteria.forEach((c) => lines.push(`- ${c}`));
    lines.push("");
  }

  if (spec.technicalConstraints?.length) {
    lines.push("## Technical Constraints");
    lines.push("");
    spec.technicalConstraints.forEach((c) => lines.push(`- ${c}`));
    lines.push("");
  }

  if (spec.stories?.length) {
    lines.push("## User Stories & Tasks");
    lines.push("");
    spec.stories
      .sort((a, b) => a.order - b.order)
      .forEach((story, i) => {
        lines.push(`### ${i + 1}. ${story.title}`);
        lines.push("");
        lines.push(story.description);
        lines.push("");
        if (story.tasks?.length) {
          story.tasks
            .sort((a, b) => a.order - b.order)
            .forEach((task) => {
              lines.push(`- [ ] ${task.content}`);
            });
          lines.push("");
        }
      });
  }

  if (spec.milestones?.length) {
    lines.push("## Milestones");
    lines.push("");
    spec.milestones
      .sort((a, b) => a.order - b.order)
      .forEach((m, i) => {
        lines.push(`${i + 1}. **${m.title}** — ${m.description}`);
      });
    lines.push("");
  }

  if (spec.risks?.length) {
    lines.push("## Risks");
    lines.push("");
    spec.risks.sort((a, b) => a.order - b.order).forEach((r) => {
      lines.push(`- ${r.content}`);
    });
    lines.push("");
  }

  if (spec.unknowns?.length) {
    lines.push("## Unknowns");
    lines.push("");
    spec.unknowns.sort((a, b) => a.order - b.order).forEach((u) => {
      lines.push(`- ${u.content}`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

export function downloadMarkdown(spec: Spec) {
  const md = specToMarkdown(spec);
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${spec.title.replace(/\s+/g, "-").toLowerCase()}-spec.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
