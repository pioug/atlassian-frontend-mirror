/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { createContext, useContext, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { defaultMedium, varColumnsNum, varColumnSpan, varGridSpacing } from './constants';
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

const getVariant = ({ medium, columns }: { medium: number; columns: number }): ColumnVariant => {
	if (medium === defaultMedium) {
		return ColumnVariant.Auto;
	} else if (medium < columns) {
		return ColumnVariant.Bounded;
	}
	return ColumnVariant.FullWidth;
};

/**
 * IE11 and Edge both have rounding issues for flexbox which is why a width of
 * 99.9999% is used. Using 100% here causes columns to wrap prematurely.
 */
const availableWidth = '99.9999%';
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const singleColumnWidth = `(${availableWidth} / var(${varColumnsNum}))`;

const gridColumnStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	minWidth: `calc(${singleColumnWidth} - var(${varGridSpacing}))`,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	margin: `0 calc(var(${varGridSpacing}) / 2)`,
	flexGrow: 1,
	flexShrink: 0,
	wordWrap: 'break-word',
});

const gridColumnWidthStyles = {
	[ColumnVariant.Auto]: css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: `calc(100% - var(${varGridSpacing}))`,
		flexBasis: `auto`,
	}),
	[ColumnVariant.Bounded]: css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: `calc(${singleColumnWidth} *  var(${varColumnSpan}) - var(${varGridSpacing}))`,
		flexBasis: `100%`,
	}),
	[ColumnVariant.FullWidth]: css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: `calc(100% - var(${varGridSpacing}))`,
		flexBasis: `100%`,
	}),
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
				css={[gridColumnStyles, gridColumnWidthStyles[variant]]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={
					{
						/**
						 * The 'auto' value here isn't actually consumed anywhere and is
						 * just to better reflect what is happening when inspecting CSS.
						 */
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
