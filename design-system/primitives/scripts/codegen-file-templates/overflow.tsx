export const overflowMap = {
  auto: 'auto',
  hidden: 'hidden',
} as const;

export type Overflow = keyof typeof overflowMap;

export const overflowInlineMap = {
  auto: 'auto',
  hidden: 'hidden',
} as const;

export type OverflowInline = keyof typeof overflowInlineMap;

export const overflowBlockMap = {
  auto: 'auto',
  hidden: 'hidden',
} as const;

export type OverflowBlock = keyof typeof overflowBlockMap;
