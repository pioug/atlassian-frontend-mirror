export const flexShrinkMap = {
  '0': 0,
  '1': 1,
} as const;

export type FlexShrink = keyof typeof flexShrinkMap;
