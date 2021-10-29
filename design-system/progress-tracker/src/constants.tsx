import { gridSize as getGridSize } from '@atlaskit/theme/constants';

export const defaultGridSize = getGridSize();

/**
 * Ideally these are exported by @atlaskit/page
 */
export const spacing = {
  comfortable: defaultGridSize * 5,
  cosy: defaultGridSize * 2,
  compact: defaultGridSize / 2,
} as const;

export type Spacing = keyof typeof spacing;
