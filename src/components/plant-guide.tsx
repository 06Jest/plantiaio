// components/plant-guide/GuideCard.tsx
//
// Presentational card for a single guide, used on the landing page grid.
// No hooks are used here, so it does not require "use client" on its own,
// but it's typically rendered inside PlantGuidePage which is a client
// component.

import Link from "next/link";
import type { PlantGuide } from "@/app/data/plant-guide-types";

interface GuideCardProps {
  guide: PlantGuide;
  /** Base path guide articles live under. Defaults to "/guide". */
  hrefBase?: string;
}

export default function GuideCard({ guide, hrefBase = "/guide" }: GuideCardProps) {
  return (
    <Link
      href={`${hrefBase}/${guide.slug}`}
      className="group flex flex-col justify-between rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <div>
        <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          {guide.categoryLabel}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-emerald-700">
          {guide.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
          {guide.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span>{guide.readingTime}</span>
        <span className="font-medium text-emerald-600 group-hover:underline">
          Read guide &rarr;
        </span>
      </div>
    </Link>
  );
}