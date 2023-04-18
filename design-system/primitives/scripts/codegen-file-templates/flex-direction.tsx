export const flexDirectionMap = {
  row: 'row',
  column: 'column',
} as const;

export type FlexDirection = keyof typeof flexDirectionMap;
