export const borderStyleMap = {
  none: 'none',
  solid: 'solid',
} as const;

export type BorderStyle = keyof typeof borderStyleMap;
