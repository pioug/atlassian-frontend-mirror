const defaultGridSize = 8;

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

/**
 * The number of available columns in each row.
 */
export const varColumnsNum = '--ds-columns-num';

/**
 * The number of columns that a `GridColumn` covers.
 */
export const varColumnSpan = '--ds-column-span';

/**
 * The spacing (in `px`) between each column.
 */
export const varGridSpacing = '--ds-grid-spacing';
