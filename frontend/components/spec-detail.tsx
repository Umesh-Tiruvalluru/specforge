"use client";

import { useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Copy,
  Download,
  Pencil,
  Check,
  X,
  AlertTriangle,
  HelpCircle,
  Flag,
  BookOpen,
  ListChecks,
  Clock,
  DollarSign,
  Target,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Spec, Story, Task } from "@/lib/types";
import { specToMarkdown, downloadMarkdown, copyToClipboard } from "@/lib/export";
import { updateSpec } from "@/lib/api";
import { toast } from "sonner";

interface SpecDetailProps {
  spec: Spec;
  onSpecUpdated: (spec: Spec) => void;
}

export function SpecDetail({ spec, onSpecUpdated }: SpecDetailProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(spec.title);
  const [editingSummary, setEditingSummary] = useState(false);
  const [editSummaryValue, setEditSummaryValue] = useState(spec.summary);
  const [localStories, setLocalStories] = useState<Story[]>(
    [...spec.stories].sort((a, b) => a.order - b.order)
  );

  const handleCopyMarkdown = useCallback(async () => {
    const md = specToMarkdown(spec);
    await copyToClipboard(md);
    setCopiedField("md");
    toast.success("Markdown copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  }, [spec]);

  const handleDownload = useCallback(() => {
    downloadMarkdown(spec);
    toast.success("Downloading spec as Markdown");
  }, [spec]);

  async function saveTitle() {
    try {
      const updated = await updateSpec(spec._id, { title: editTitleValue });
      onSpecUpdated(updated);
      setEditingTitle(false);
      toast.success("Title updated");
    } catch {
      toast.error("Failed to update title");
    }
  }

  async function saveSummary() {
    try {
      const updated = await updateSpec(spec._id, { summary: editSummaryValue });
      onSpecUpdated(updated);
      setEditingSummary(false);
      toast.success("Summary updated");
    } catch {
      toast.error("Failed to update summary");
    }
  }

  function moveStory(index: number, direction: "up" | "down") {
    const newStories = [...localStories];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= newStories.length) return;
    [newStories[index], newStories[swapIdx]] = [
      newStories[swapIdx],
      newStories[index],
    ];
    newStories.forEach((s, i) => (s.order = i));
    setLocalStories(newStories);
  }

  function moveTask(storyIdx: number, taskIdx: number, direction: "up" | "down") {
    const newStories = [...localStories];
    const tasks = [...newStories[storyIdx].tasks];
    const swapIdx = direction === "up" ? taskIdx - 1 : taskIdx + 1;
    if (swapIdx < 0 || swapIdx >= tasks.length) return;
    [tasks[taskIdx], tasks[swapIdx]] = [tasks[swapIdx], tasks[taskIdx]];
    tasks.forEach((t, i) => (t.order = i));
    newStories[storyIdx] = { ...newStories[storyIdx], tasks };
    setLocalStories(newStories);
  }

  const complexityColor: Record<string, string> = {
    low: "bg-chart-1/20 text-chart-1 border-chart-1/30",
    medium: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    high: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 flex-1">
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editTitleValue}
                    onChange={(e) => setEditTitleValue(e.target.value)}
                    className="text-xl font-bold bg-secondary/50"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={saveTitle}>
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingTitle(false);
                      setEditTitleValue(spec.title);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="text-2xl font-bold tracking-tight text-balance">
                    {spec.title}
                  </h1>
                  <button
                    onClick={() => setEditingTitle(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Edit title"
                  >
                    <Pencil className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{spec.productType}</Badge>
                <Badge
                  variant="outline"
                  className={
                    complexityColor[spec.complexity] || "border-border"
                  }
                >
                  {spec.complexity}
                </Badge>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {spec.estimatedTimeline}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyMarkdown}
              >
                {copiedField === "md" ? (
                  <Check className="size-3.5" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="size-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Summary */}
          {editingSummary ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={editSummaryValue}
                onChange={(e) => setEditSummaryValue(e.target.value)}
                rows={3}
                className="bg-secondary/50 resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={saveSummary}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingSummary(false);
                    setEditSummaryValue(spec.summary);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer hover:text-foreground transition-colors group"
              onClick={() => setEditingSummary(true)}
            >
              {spec.summary}
              <Pencil className="size-3 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </p>
          )}
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {spec.targetUser && (
            <MetaCard
              icon={<Target className="size-3.5" />}
              label="Target Users"
              value={spec.targetUser}
            />
          )}
          {spec.timelineConstraint && (
            <MetaCard
              icon={<Clock className="size-3.5" />}
              label="Timeline"
              value={spec.timelineConstraint}
            />
          )}
          {spec.budgetConstraint && (
            <MetaCard
              icon={<DollarSign className="size-3.5" />}
              label="Budget"
              value={spec.budgetConstraint}
            />
          )}
          {spec.stories?.length > 0 && (
            <MetaCard
              icon={<ListChecks className="size-3.5" />}
              label="Stories"
              value={`${spec.stories.length} stories, ${spec.stories.reduce(
                (sum, s) => sum + (s.tasks?.length || 0),
                0
              )} tasks`}
            />
          )}
        </div>

        {/* Success Criteria */}
        {spec.successCriteria?.length > 0 && (
          <CollapsibleSection
            title="Success Criteria"
            icon={<Target className="size-4" />}
            count={spec.successCriteria.length}
            defaultOpen
          >
            <ul className="flex flex-col gap-1.5">
              {spec.successCriteria.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  {c}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        {/* Technical Constraints */}
        {spec.technicalConstraints?.length > 0 && (
          <CollapsibleSection
            title="Technical Constraints"
            icon={<Wrench className="size-4" />}
            count={spec.technicalConstraints.length}
          >
            <ul className="flex flex-col gap-1.5">
              {spec.technicalConstraints.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  {c}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        <Separator />

        {/* Stories & Tasks */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">User Stories & Tasks</h2>
            <Badge variant="secondary">{localStories.length}</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {localStories.map((story, storyIdx) => (
              <StoryCard
                key={story._id}
                story={story}
                index={storyIdx}
                total={localStories.length}
                onMoveStory={(dir) => moveStory(storyIdx, dir)}
                onMoveTask={(taskIdx, dir) =>
                  moveTask(storyIdx, taskIdx, dir)
                }
              />
            ))}
          </div>
        </div>

        {/* Milestones */}
        {spec.milestones?.length > 0 && (
          <>
            <Separator />
            <CollapsibleSection
              title="Milestones"
              icon={<Flag className="size-4" />}
              count={spec.milestones.length}
              defaultOpen
            >
              <div className="flex flex-col gap-3">
                {[...spec.milestones]
                  .sort((a, b) => a.order - b.order)
                  .map((m, i) => (
                    <div
                      key={m._id}
                      className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{m.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {m.description}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CollapsibleSection>
          </>
        )}

        {/* Risks */}
        {spec.risks?.length > 0 && (
          <CollapsibleSection
            title="Risks"
            icon={<AlertTriangle className="size-4" />}
            count={spec.risks.length}
            defaultOpen
            variant="destructive"
          >
            <div className="flex flex-col gap-2">
              {[...spec.risks]
                .sort((a, b) => a.order - b.order)
                .map((r) => (
                  <div
                    key={r._id}
                    className="flex items-start gap-2 rounded-md bg-destructive/5 border border-destructive/20 px-3 py-2 text-sm text-muted-foreground"
                  >
                    <AlertTriangle className="size-3.5 mt-0.5 shrink-0 text-destructive" />
                    {r.content}
                  </div>
                ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Unknowns */}
        {spec.unknowns?.length > 0 && (
          <CollapsibleSection
            title="Unknowns"
            icon={<HelpCircle className="size-4" />}
            count={spec.unknowns.length}
            defaultOpen
            variant="warning"
          >
            <div className="flex flex-col gap-2">
              {[...spec.unknowns]
                .sort((a, b) => a.order - b.order)
                .map((u) => (
                  <div
                    key={u._id}
                    className="flex items-start gap-2 rounded-md bg-chart-3/5 border border-chart-3/20 px-3 py-2 text-sm text-muted-foreground"
                  >
                    <HelpCircle className="size-3.5 mt-0.5 shrink-0 text-chart-3" />
                    {u.content}
                  </div>
                ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Generated timestamp */}
        <p className="text-xs text-muted-foreground text-center pb-4">
          Generated on{" "}
          {new Date(spec.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </ScrollArea>
  );
}

/* Sub-components */

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/30 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px] uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <span className="text-sm font-medium leading-snug">{value}</span>
    </div>
  );
}

function CollapsibleSection({
  title,
  icon,
  count,
  children,
  defaultOpen = false,
  variant,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: "destructive" | "warning";
}) {
  const [open, setOpen] = useState(defaultOpen);
  const badgeClass =
    variant === "destructive"
      ? "bg-destructive/20 text-destructive border-destructive/30"
      : variant === "warning"
        ? "bg-chart-3/20 text-chart-3 border-chart-3/30"
        : "";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-2 py-1 hover:text-foreground transition-colors">
        {open ? (
          <ChevronDown className="size-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}
        {icon}
        <span className="text-sm font-semibold">{title}</span>
        <Badge variant="outline" className={badgeClass}>
          {count}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function StoryCard({
  story,
  index,
  total,
  onMoveStory,
  onMoveTask,
}: {
  story: Story;
  index: number;
  total: number;
  onMoveStory: (dir: "up" | "down") => void;
  onMoveTask: (taskIdx: number, dir: "up" | "down") => void;
}) {
  const [open, setOpen] = useState(true);
  const tasks = [...(story.tasks || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary/30">
        <GripVertical className="size-4 text-muted-foreground shrink-0" />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            disabled={index === 0}
            onClick={() => onMoveStory("up")}
            aria-label="Move story up"
          >
            <ArrowUp className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            disabled={index === total - 1}
            onClick={() => onMoveStory("down")}
            aria-label="Move story down"
          >
            <ArrowDown className="size-3" />
          </Button>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {open ? (
            <ChevronDown className="size-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">{story.title}</span>
          <Badge variant="secondary" className="text-[10px]">
            {tasks.length} tasks
          </Badge>
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-0 border-t border-border">
          <p className="px-4 py-2 text-xs text-muted-foreground leading-relaxed">
            {story.description}
          </p>
          {tasks.length > 0 && (
            <div className="flex flex-col">
              {tasks.map((task, taskIdx) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  index={taskIdx}
                  total={tasks.length}
                  onMove={(dir) => onMoveTask(taskIdx, dir)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  index,
  total,
  onMove,
}: {
  task: Task;
  index: number;
  total: number;
  onMove: (dir: "up" | "down") => void;
}) {
  return (
    <div className="group flex items-center gap-2 border-t border-border/50 px-4 py-2 hover:bg-secondary/20 transition-colors">
      <GripVertical className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="size-5"
          disabled={index === 0}
          onClick={() => onMove("up")}
          aria-label="Move task up"
        >
          <ArrowUp className="size-2.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-5"
          disabled={index === total - 1}
          onClick={() => onMove("down")}
          aria-label="Move task down"
        >
          <ArrowDown className="size-2.5" />
        </Button>
      </div>
      <span className="size-1.5 shrink-0 rounded-full bg-primary/40" />
      <span className="text-sm text-muted-foreground">{task.content}</span>
    </div>
  );
}
