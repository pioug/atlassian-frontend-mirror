export const displayMap = {
  flex: 'flex',
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
  inlineFlex: 'inline-flex',
  grid: 'grid',
} as const;

export type Display = keyof typeof displayMap;
