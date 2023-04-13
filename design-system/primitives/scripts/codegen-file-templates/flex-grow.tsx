export const flexGrowMap = {
  '0': 0,
  '1': 1,
} as const;

export type FlexGrow = keyof typeof flexGrowMap;
