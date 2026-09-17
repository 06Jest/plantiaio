// components/plant-guide/PlantGuidePage.tsx
//
// Landing/library page for the static Plant Guide. Owns search and
// category-filter state, and renders the filtered grid of GuideCards.
// This component never calls an API. All data comes from
// data/plant-guides.ts.

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import GuideCard from "./plant-guide";
import GuideSearch from "./guide-search";
import CategoryFilter from "./category-filter";
import { CATEGORIES, getAllGuides, searchGuides } from "@/app/data/plant-guides";
import type { GuideCategory } from "@/app/data/plant-guide-types";

interface PlantGuidePageProps {
  /** Base path guide articles live under. Defaults to "/guide". */
  hrefBase?: string;
  /** Optional link to the AI Plant Expert page. Omit to hide the callout. */
  plantExpertHref?: string;
}

export default function PlantGuidePage({
  hrefBase = "/guide",
  plantExpertHref,
}: PlantGuidePageProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GuideCategory | "all">("all");

  const allGuides = useMemo(() => getAllGuides(), []);

  const filteredGuides = useMemo(() => {
    const byCategory =
      category === "all"
        ? allGuides
        : allGuides.filter((guide) => guide.category === category);

    return searchGuides(byCategory, query);
  }, [allGuides, category, query]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-900"
          >
            <span aria-hidden="true">←</span>
            Back to Plantiaio
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Plantiaio Plant Guide
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Plant Care Guide
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              A library of general plant-care fundamentals: watering, light,
              soil, and troubleshooting. Learn the reasoning behind the
              advice and use it as a starting point for understanding your
              plants.
            </p>

            {plantExpertHref && (
              <p className="mt-3 text-sm text-gray-500">
                Have a question about a specific plant?{" "}
                <Link
                  href={plantExpertHref}
                  className="font-medium text-emerald-600 hover:underline"
                >
                  Ask Plant Expert
                </Link>{" "}
                for personalized help.
              </p>
            )}
          </div>

        </div>
      </header>

      <div className="mb-6 w-full">
        <GuideSearch value={query} onChange={setQuery} />
      </div>

      <div className="mb-8">
        <CategoryFilter
          categories={CATEGORIES}
          selected={category}
          onSelect={setCategory}
        />
      </div>

      {filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} hrefBase={hrefBase} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
          <p className="text-base font-medium text-gray-700">
            No guides match your search.
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Try a different term, or{" "}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="font-medium text-emerald-600 hover:underline"
            >
              clear filters
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}