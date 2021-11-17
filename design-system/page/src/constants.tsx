export const defaultGridSize = 8;

export const defaultGridColumns = 12;

export const defaultGridColumnWidth = defaultGridSize * 10;

export const spacingMapping = {
  comfortable: defaultGridSize * 5,
  cosy: defaultGridSize * 2,
  compact: defaultGridSize * 0.5,
} as const;

export type GridSpacing = keyof typeof spacingMapping;

export const defaultSpacing = 'cosy';

export const defaultBannerHeight = 52;

// Corresponds to an `auto` width/flex-basis
export const defaultMedium = 0;

export const defaultLayout = 'fixed';

export const varColumnsNum = '--ds-columns-num';

export const varColumnSpan = '--ds-column-span';
