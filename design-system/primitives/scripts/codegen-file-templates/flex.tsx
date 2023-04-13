export const flexMap = {
  '1': 1,
} as const;

export type Flex = keyof typeof flexMap;
