import { gridSize } from '@atlaskit/theme/constants';

export const defaultGridSize = gridSize();

/** Ideally these are exported by @atlaskit/page */
export const spacing: Record<string, number> = {
  comfortable: defaultGridSize * 5,
  cosy: defaultGridSize * 2,
  compact: defaultGridSize * 0.5,
};
