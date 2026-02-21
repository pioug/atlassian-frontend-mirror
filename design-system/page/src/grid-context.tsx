import { createContext } from 'react';

import { defaultGridColumns, defaultSpacing } from './constants';
import { type GridSpacing } from './types';

type GridContextProps = {
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
export const GridContext: import('react').Context<GridContextProps> =
	createContext<GridContextProps>({
		isRoot: true,
		isNested: false,
		spacing: defaultSpacing,
		columns: defaultGridColumns,
	});
