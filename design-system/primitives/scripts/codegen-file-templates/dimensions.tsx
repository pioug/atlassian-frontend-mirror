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
