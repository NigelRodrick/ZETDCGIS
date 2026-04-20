/** Preset values for quick taps in the Collect form — adjust to your project. */

export const FEATURE_TYPES = [
  "Point / asset",
  "Vegetation",
  "Infrastructure",
  "Boundary / line",
  "Water / hydrology",
  "Soil / erosion",
  "Other",
] as const;

export type FeatureType = (typeof FEATURE_TYPES)[number] | "";

export const CONDITIONS = ["Good", "Fair", "Poor", "Unknown"] as const;

export type ConditionValue = (typeof CONDITIONS)[number] | "";
