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
type Dimension = keyof typeof dimensionMap;

export type Width = Dimension;
export type Height = Dimension;
export type MinWidth = Dimension;
export type MaxWidth = Dimension;
export type MinHeight = Dimension;
export type MaxHeight = Dimension;
export type Top = Dimension;
export type Left = Dimension;
export type Bottom = Dimension;
export type Right = Dimension;
export type BlockSize = Dimension;
export type InlineSize = Dimension;
export type MaxBlockSize = Dimension;
export type MaxInlineSize = Dimension;
export type MinBlockSize = Dimension;
export type MinInlineSize = Dimension;
