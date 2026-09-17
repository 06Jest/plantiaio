// components/plant-guide/CategoryFilter.tsx
//
// Category pill filter. Uses onClick handlers, so it needs a client
// boundary above it in the tree - PlantGuidePage already provides that
// via its own "use client" directive, so this file doesn't need its own.

import type {
  GuideCategory,
  GuideCategoryInfo,
} from "@/app/data/plant-guide-types";

interface CategoryFilterProps {
  categories: GuideCategoryInfo[];
  selected: GuideCategory | "all";
  onSelect: (category: GuideCategory | "all") => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter guides by category"
    >
      <button
        type="button"
        onClick={() => onSelect("all")}
        aria-pressed={selected === "all"}
        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
          selected === "all"
            ? "bg-emerald-600 text-white"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        All guides
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          aria-pressed={selected === category.id}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            selected === category.id
              ? "bg-emerald-600 text-white"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}