// components/plant-guide/GuideSearch.tsx
//
// Controlled search input. Requires "use client" because it attaches an
// onChange handler.

"use client";

import type { ChangeEvent } from "react";

interface GuideSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function GuideSearch({
  value,
  onChange,
  placeholder = "Search guides...",
}: GuideSearchProps) {
  return (
    <div className="relative w-full">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 4.65a7.5 7.5 0 0011.99 11.99z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search plant care guides"
        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  );
}