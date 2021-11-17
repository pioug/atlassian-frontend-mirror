import { createContext } from 'react';

import { defaultGridColumns, defaultSpacing } from './constants';
import { GridSpacing } from './types';

export type GridContextProps = {
  isRoot: boolean;
  isNested: boolean;
  spacing: GridSpacing;
  columns: number;
};

/**
 * __Grid context__
 *
 * Provides contextual information which is used by both
 * the `Grid` and its `GridColumn` children.
 *
 * @internal
 */
export const GridContext = createContext<GridContextProps>({
  isRoot: true,
  isNested: false,
  spacing: defaultSpacing,
  columns: defaultGridColumns,
});
