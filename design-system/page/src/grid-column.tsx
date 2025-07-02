/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { createContext, useContext, useMemo } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { defaultMedium } from './constants';
import { GridContext } from './grid-context';
import type { GridColumnProps } from './types';

/**
 * Determines the method by which column width is calculated.
 */
enum ColumnVariant {
	/**
	 * Column occupies available space.
	 *
	 * Used when `medium` is 0 (the default).
	 */
	Auto = 'auto',
	/**
	 * Column occupies specified space.
	 *
	 * Used when 0 < `medium` < `columns`.
	 */
	Bounded = 'bounded',
	/**
	 * Column occupies entire row.
	 *
	 * Used when `medium` >= `columns`.
	 *
	 * This case is handled separately because of rounding.
	 */
	FullWidth = 'fullWidth',
}

/**
 * The spacing (in `px`) between each column.
 */
const varGridSpacing = '--ds-grid-spacing';

/**
 * The number of columns that a `GridColumn` covers.
 */
const varColumnSpan = '--ds-column-span';

/**
 * IE11 and Edge both have rounding issues for flexbox which is why a width of
 * 99.9999% is used. Using 100% here causes columns to wrap prematurely.
 */
const singleColumnWidth = `(99.9999% / var(--ds-columns-num))`;

const styles = cssMap({
	gridColumn: {
		margin: `0 calc(var(${varGridSpacing}) / 2)`,
		minWidth: `calc(${singleColumnWidth} - var(${varGridSpacing}))`,
		flexGrow: 1,
		flexShrink: 0,
		wordWrap: 'break-word',
	},
});

const gridColumnWidthMapStyles = cssMap({
	auto: {
		maxWidth: `calc(100% - var(${varGridSpacing}))`,
		flexBasis: `auto`,
	},
	bounded: {
		maxWidth: `calc(${singleColumnWidth} *  var(${varColumnSpan}) - var(${varGridSpacing}))`,
		flexBasis: `100%`,
	},
	fullWidth: {
		maxWidth: `calc(100% - var(${varGridSpacing}))`,
		flexBasis: `100%`,
	},
});

const getVariant = ({ medium, columns }: { medium: number; columns: number }): ColumnVariant => {
	if (medium === defaultMedium) {
		return ColumnVariant.Auto;
	} else if (medium < columns) {
		return ColumnVariant.Bounded;
	}
	return ColumnVariant.FullWidth;
};

/**
 * __Grid column context__
 *
 * @internal
 */
export const GridColumnContext = createContext({ medium: defaultMedium });

/**
 * __Grid column__
 *
 * A grid column can span one or more column positions within a grid.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/page)
 */
const GridColumn = ({ medium = defaultMedium, children, testId }: GridColumnProps) => {
	const { columns } = useContext(GridContext);

	const contextValue = useMemo(() => ({ medium }), [medium]);

	/**
	 * The real column span,
	 * obtained by clamping the passed `medium` value within the allowed range.
	 */
	const colSpan = Math.max(1, Math.min(medium, columns));

	/**
	 * How we should calculate the column width.
	 */
	const variant = getVariant({ medium, columns });

	return (
		<GridColumnContext.Provider value={contextValue}>
			<div
				css={[styles.gridColumn, gridColumnWidthMapStyles[variant]]}
				style={
					{
						/**
						 * The 'auto' value here isn't actually consumed anywhere and is
						 * just to better reflect what is happening when inspecting CSS.
						 */
						[varColumnSpan]: variant === ColumnVariant.Auto ? 'auto' : colSpan,
					} as React.CSSProperties
				}
				data-testid={testId}
			>
				{children}
			</div>
		</GridColumnContext.Provider>
	);
};

export default GridColumn;
