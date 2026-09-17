export const PLANT_CATEGORIES = ["vegetable", "fruit", "flower", "herb", "indoor", "other"] as const;
export const PLANT_STATUSES = ["growing", "healthy", "needs_water", "sick", "pest_infestation", "damaged", "sunburned", "dormant"] as const;
export const CARE_ACTIVITIES = ["watering", "feeding", "pruning", "repotting", "pest_treatment", "other"] as const;

export type PlantCategory = (typeof PLANT_CATEGORIES)[number];
export type PlantStatus = (typeof PLANT_STATUSES)[number];
export type CareActivity = (typeof CARE_ACTIVITIES)[number];

export const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function isOneOf<T extends readonly string[]>(value: string, options: T): value is T[number] {
  return options.includes(value);
}
