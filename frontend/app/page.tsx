"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { Hammer, Plus, ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GenerateForm } from "@/components/generate-form";
import { SpecDetail } from "@/components/spec-detail";
import { RecentSpecs } from "@/components/recent-specs";
import { SpecLoadingSkeleton } from "@/components/spec-loading";
import {
  generateSpec,
  fetchSpecs,
  fetchSpec,
  deleteSpec,
} from "@/lib/api";
import type { GeneratePayload, Spec, SpecListItem } from "@/lib/types";
import { toast } from "sonner";

type View = "form" | "detail" | "loading";

export default function HomePage() {
  const [view, setView] = useState<View>("form");
  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
  const [currentSpec, setCurrentSpec] = useState<Spec | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingSpec, setIsLoadingSpec] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data: specsData,
    isLoading: isLoadingSpecs,
    mutate: mutateSpecs,
  } = useSWR("specs-list", () => fetchSpecs(1, 5), {
    revalidateOnFocus: false,
    fallbackData: { specs: [], pagination: undefined },
  });

  const specs: SpecListItem[] = specsData?.specs || [];

  const handleGenerate = useCallback(
    async (payload: GeneratePayload) => {
      setIsGenerating(true);
      setView("loading");
      try {
        const { specId } = await generateSpec(payload);
        const spec = await fetchSpec(specId);
        setCurrentSpec(spec);
        setSelectedSpecId(specId);
        setView("detail");
        toast.success("Spec generated successfully!");
        mutateSpecs();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to generate spec";
        toast.error(message);
        setView("form");
      } finally {
        setIsGenerating(false);
      }
    },
    [mutateSpecs]
  );

  const handleSelectSpec = useCallback(async (id: string) => {
    setSelectedSpecId(id);
    setIsLoadingSpec(true);
    setView("loading");
    setSidebarOpen(false);
    try {
      const spec = await fetchSpec(id);
      setCurrentSpec(spec);
      setView("detail");
    } catch {
      toast.error("Failed to load spec");
      setView("form");
    } finally {
      setIsLoadingSpec(false);
    }
  }, []);

  const handleDeleteSpec = useCallback(
    async (id: string) => {
      try {
        await deleteSpec(id);
        toast.success("Spec deleted");
        if (selectedSpecId === id) {
          setSelectedSpecId(null);
          setCurrentSpec(null);
          setView("form");
        }
        mutateSpecs();
      } catch {
        toast.error("Failed to delete spec");
      }
    },
    [selectedSpecId, mutateSpecs]
  );

  const handleNewSpec = useCallback(() => {
    setSelectedSpecId(null);
    setCurrentSpec(null);
    setView("form");
    setSidebarOpen(false);
  }, []);

  const handleSpecUpdated = useCallback(
    (updated: Spec) => {
      setCurrentSpec(updated);
      mutateSpecs();
    },
    [mutateSpecs]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Hammer className="size-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">
                SpecForge
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                AI Task Generator
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="px-3 pb-3">
          <Button
            onClick={handleNewSpec}
            className="w-full"
            size="sm"
          >
            <Plus className="size-4" />
            New Spec
          </Button>
        </div>

        <Separator />

        <div className="flex-1 overflow-hidden">
          <RecentSpecs
            specs={specs}
            isLoading={isLoadingSpecs}
            selectedId={selectedSpecId}
            onSelect={handleSelectSpec}
            onDelete={handleDeleteSpec}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          {view === "detail" && currentSpec && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewSpec}
              className="text-muted-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back
            </Button>
          )}
          <div className="flex-1" />
          {view === "form" && (
            <span className="text-xs text-muted-foreground font-mono">
              {specs.length} specs generated
            </span>
          )}
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto">
          {view === "form" && (
            <div className="mx-auto w-full max-w-2xl px-4 py-8 lg:px-0">
              <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-balance">
                  Generate a Product Spec
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Describe your product idea and AI will generate user stories,
                  engineering tasks, milestones, risks, and unknowns.
                </p>
              </div>
              <GenerateForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {view === "loading" && <SpecLoadingSkeleton />}

          {view === "detail" && currentSpec && (
            <SpecDetail
              spec={currentSpec}
              onSpecUpdated={handleSpecUpdated}
            />
          )}
        </div>
      </main>
    </div>
  );
}
