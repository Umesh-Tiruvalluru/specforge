"use client";

import {
  Clock,
  FileText,
  Trash2,
  Globe,
  Smartphone,
  Server,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { SpecListItem } from "@/lib/types";

const productTypeIcons: Record<string, React.ReactNode> = {
  "web-app": <Globe className="size-3.5" />,
  "mobile-app": <Smartphone className="size-3.5" />,
  api: <Server className="size-3.5" />,
  saas: <Building2 className="size-3.5" />,
};

interface RecentSpecsProps {
  specs: SpecListItem[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RecentSpecs({
  specs,
  isLoading,
  selectedId,
  onSelect,
  onDelete,
}: RecentSpecsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-1">
          <Clock className="size-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Recent Specs
          </span>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-lg border border-border p-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (specs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-secondary">
          <FileText className="size-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">No specs yet</span>
          <span className="text-xs text-muted-foreground">
            Generate your first product spec to get started.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-4 pt-4 text-muted-foreground">
        <Clock className="size-4" />
        <span className="text-xs font-medium uppercase tracking-wider">
          Recent Specs
        </span>
        <Badge variant="secondary" className="text-[10px] ml-auto">
          {specs.length}
        </Badge>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1.5 px-3 pb-3">
          {specs.map((spec) => {
            const isSelected = selectedId === spec._id;
            return (
              <button
                key={spec._id}
                onClick={() => onSelect(spec._id)}
                className={`group flex flex-col gap-1.5 rounded-lg border p-3 text-left transition-colors ${
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-transparent hover:border-border hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-sm font-medium leading-tight line-clamp-1 ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {spec.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(spec._id);
                    }}
                    aria-label={`Delete ${spec.title}`}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {spec.goal}
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    {productTypeIcons[spec.productType] || (
                      <FileText className="size-3" />
                    )}
                    {spec.productType}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(spec.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
