// data/plant-guide-types.ts
//
// Shared types for the static Plant Guide feature. Kept separate from
// plant-guides.ts so the data file (which will grow large) stays focused
// on content.

export type GuideCategory =
  | "watering"
  | "lighting"
  | "soil"
  | "fertilizing"
  | "climate"
  | "repotting"
  | "pruning"
  | "propagation"
  | "pests"
  | "diseases"
  | "troubleshooting"
  | "plant-types";

export interface GuideSection {
  /** Used as the DOM id for anchor links / table of contents. Keep kebab-case. */
  id: string;
  heading: string;
  paragraphs: string[];
  /** Optional short label shown above the bullet list, e.g. "Signs to watch for". */
  bulletsTitle?: string;
  bullets?: string[];
}

export interface PlantGuide {
  /** URL-safe unique identifier, e.g. "watering" -> /guide/watering */
  slug: string;
  title: string;
  /** One or two sentence summary shown on cards and at the top of the article. */
  description: string;
  category: GuideCategory;
  /** Human-readable label for the category, e.g. "Temperature & Humidity". */
  categoryLabel: string;
  /** Display-only estimate, e.g. "6 min read". */
  readingTime: string;
  /** Lowercase search keywords in addition to title/description/category. */
  keywords: string[];
  sections: GuideSection[];
  /** Slugs of related guides, resolved to full PlantGuide objects at render time. */
  relatedSlugs: string[];
}

export interface GuideCategoryInfo {
  id: GuideCategory;
  label: string;
}