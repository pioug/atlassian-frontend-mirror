export const dimensionMap = {
  '100%': '100%',
  'size.100': '16px',
  'size.200': '24px',
  'size.300': '32px',
  'size.400': '40px',
  'size.500': '48px',
  'size.600': '96px',
  'size.1000': '192px',
} as const;

export type Width = keyof typeof dimensionMap;
export type Height = keyof typeof dimensionMap;
export type MinWidth = keyof typeof dimensionMap;
export type MaxWidth = keyof typeof dimensionMap;
export type MinHeight = keyof typeof dimensionMap;
export type MaxHeight = keyof typeof dimensionMap;
