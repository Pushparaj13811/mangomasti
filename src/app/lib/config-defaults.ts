// Default configuration keys and values
export const DEFAULT_CONFIG = {
  show_season: "false",
  show_origin: "false",
  show_taste: "false",
  show_original_price: "true",
  show_discounted_price: "true",
  show_tags: "true",
} as const;

export type ConfigKey = keyof typeof DEFAULT_CONFIG;
