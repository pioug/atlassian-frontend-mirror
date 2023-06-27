export const dimensionMap = {
  '100%': '100%',
  'size.100': '1rem',
  'size.200': '1.5rem',
  'size.300': '2rem',
  'size.400': '2.5rem',
  'size.500': '3rem',
  'size.600': '6rem',
  'size.1000': '12rem',
} as const;
export type Dimension = keyof typeof dimensionMap;
