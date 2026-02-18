"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Zap,
  ChevronDown,
  ChevronUp,
  Loader2,
  Globe,
  Smartphone,
  Server,
  Building2,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/lib/templates";
import type { GeneratePayload, Template } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  goal: z.string().min(10, "Goal must be at least 10 characters"),
  targetUsers: z.string().min(3, "Target users must be at least 3 characters"),
  productType: z.string().min(1, "Select a product type"),
  successCriteria: z.string().optional(),
  technicalConstraints: z.string().optional(),
  timelineConstraint: z.string().optional(),
  budgetConstraint: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const productTypes = [
  { value: "web-app", label: "Web App", icon: Globe },
  { value: "mobile-app", label: "Mobile", icon: Smartphone },
  { value: "api", label: "API", icon: Server },
  { value: "saas", label: "SaaS", icon: Building2 },
];

interface GenerateFormProps {
  onGenerate: (payload: GeneratePayload) => Promise<void>;
  isGenerating: boolean;
}

export function GenerateForm({ onGenerate, isGenerating }: GenerateFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      goal: "",
      targetUsers: "",
      productType: "",
      successCriteria: "",
      technicalConstraints: "",
      timelineConstraint: "",
      budgetConstraint: "",
    },
  });

  const currentProductType = watch("productType");

  function applyTemplate(template: Template) {
    setSelectedTemplate(template.name);
    if (template.defaults.productType) {
      setValue("productType", template.defaults.productType);
    }
    if (template.defaults.technicalConstraints) {
      setValue("technicalConstraints", template.defaults.technicalConstraints);
    }
    if (template.defaults.successCriteria) {
      setValue("successCriteria", template.defaults.successCriteria);
    }
    setShowAdvanced(true);
  }

  function onSubmit(data: FormValues) {
    const payload: GeneratePayload = {
      title: data.title,
      goal: data.goal,
      targetUsers: data.targetUsers,
      productType: data.productType,
    };
    if (data.successCriteria) payload.successCriteria = data.successCriteria;
    if (data.technicalConstraints)
      payload.technicalConstraints = data.technicalConstraints;
    if (data.timelineConstraint)
      payload.timelineConstraint = data.timelineConstraint;
    if (data.budgetConstraint)
      payload.budgetConstraint = data.budgetConstraint;

    onGenerate(payload);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Templates */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Wrench className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Quick Start Templates
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => applyTemplate(t)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                selectedTemplate === t.name
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
        {selectedTemplate && (
          <p className="text-xs text-muted-foreground">
            {templates.find((t) => t.name === selectedTemplate)?.description}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Product Name</Label>
          <Input
            id="title"
            placeholder="e.g. TaskFlow Pro"
            className="bg-secondary/50"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Goal */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="goal">What problem does it solve?</Label>
          <Textarea
            id="goal"
            placeholder="Help small teams track tasks without enterprise complexity..."
            rows={3}
            className="bg-secondary/50 resize-none"
            {...register("goal")}
          />
          {errors.goal && (
            <p className="text-xs text-destructive">{errors.goal.message}</p>
          )}
        </div>

        {/* Target Users */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="targetUsers">Who will use this?</Label>
          <Input
            id="targetUsers"
            placeholder="e.g. Engineering teams of 2-10 at early-stage startups"
            className="bg-secondary/50"
            {...register("targetUsers")}
          />
          {errors.targetUsers && (
            <p className="text-xs text-destructive">
              {errors.targetUsers.message}
            </p>
          )}
        </div>

        {/* Product Type */}
        <div className="flex flex-col gap-1.5">
          <Label>Product Type</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {productTypes.map((pt) => {
              const Icon = pt.icon;
              return (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setValue("productType", pt.value)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    currentProductType === pt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {pt.label}
                </button>
              );
            })}
          </div>
          {errors.productType && (
            <p className="text-xs text-destructive">
              {errors.productType.message}
            </p>
          )}
        </div>

        {/* Advanced Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
          Constraints & Success Criteria
          <Badge variant="secondary" className="text-[10px]">
            Optional
          </Badge>
        </button>

        {showAdvanced && (
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="successCriteria">Success Criteria</Label>
              <Input
                id="successCriteria"
                placeholder="e.g. Sub-2s page loads, 80% adoption rate"
                className="bg-background"
                {...register("successCriteria")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="technicalConstraints">
                Technical Constraints
              </Label>
              <Input
                id="technicalConstraints"
                placeholder="e.g. Must work offline, React/Next.js frontend"
                className="bg-background"
                {...register("technicalConstraints")}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="timelineConstraint">Timeline</Label>
                <Input
                  id="timelineConstraint"
                  placeholder="e.g. MVP in 3 months"
                  className="bg-background"
                  {...register("timelineConstraint")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="budgetConstraint">Budget</Label>
                <Input
                  id="budgetConstraint"
                  placeholder="e.g. Under $50k"
                  className="bg-background"
                  {...register("budgetConstraint")}
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating Spec...
            </>
          ) : (
            <>
              <Zap className="size-4" />
              Generate Spec
            </>
          )}
        </Button>

        {isGenerating && (
          <p className="text-center text-xs text-muted-foreground">
            AI is analyzing your product idea. This may take 10-30 seconds...
          </p>
        )}
      </form>
    </div>
  );
}
