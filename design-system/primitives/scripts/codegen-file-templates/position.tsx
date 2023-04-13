export const positionMap = {
  absolute: 'absolute',
  fixed: 'fixed',
  relative: 'relative',
  static: 'static',
} as const;

export type Position = keyof typeof positionMap;
