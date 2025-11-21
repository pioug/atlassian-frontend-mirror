import React, { useContext, useMemo } from 'react';

import { defaultGridColumns, defaultSpacing } from './constants';
import { Grid } from './grid';
import { GridColumnContext } from './grid-column';
import { GridContext } from './grid-context';
import type { GridProps } from './types';

/**
 * __Grid__
 *
 * A grid contains one or more `GridColumn` to provide a grid layout.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/page)
 */
const GridWrapper = ({
	spacing: spacingProp,
	columns: columnsProp,
	layout,
	testId,
	children,
	theme,
}: GridProps): React.JSX.Element => {
	/**
	 * isRoot is `true` only in the default context (i.e. no ancestor Grid).
	 */
	const { isRoot } = useContext(GridContext);
	const { medium } = useContext(GridColumnContext);

	/**
	 * The colspan of the current containing GridColumn provides
	 * the default amount of columns in a nested grid.
	 */
	const defaultColumns = medium > 0 ? medium : defaultGridColumns;

	/**
	 * This is to account for the eventual removal of the `theme` prop. In theory, this should not be exposed.
	 * However, consumers are still using it - there should be a major rerelease with the complete removal of this prop later.
	 */
	const spacing = spacingProp ?? theme?.spacing ?? defaultSpacing;
	const columns = columnsProp ?? theme?.columns ?? defaultColumns;
	const isNested = theme?.isNestedGrid ?? !isRoot;

	const contextValue = useMemo(
		() => ({
			isRoot: false,
			isNested,
			spacing,
			columns: columns,
		}),
		[spacing, columns, isNested],
	);

	return (
		<GridContext.Provider value={contextValue}>
			<Grid layout={layout} testId={testId}>
				{children}
			</Grid>
		</GridContext.Provider>
	);
};

export default GridWrapper;
