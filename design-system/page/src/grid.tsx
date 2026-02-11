/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { defaultLayout, spacingMapping } from './constants';
import { GridContext } from './grid-context';
import type { GridProps } from './types';

const defaultGridColumnWidth = 80;

/**
 * The number of available columns in each row.
 */
const varColumnsNum = '--ds-columns-num';

/**
 * The spacing (in `px`) between each column.
 */
const varGridSpacing = '--ds-grid-spacing';

const styles = cssMap({
	grid: {
		display: 'flex',
		margin: '0 auto',
		padding: `0 calc(var(${varGridSpacing}) / 2)`,
		position: 'relative',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
	},
	nestedGrid: {
		margin: `0 calc(-1 * var(${varGridSpacing}))`,
	},
});

const gridLayoutMapStyles = cssMap({
	fixed: {
		maxWidth: `calc(var(${varColumnsNum}) * ${defaultGridColumnWidth}px)`,
	},
	fluid: {
		maxWidth: '100%',
	},
});

/**
 * __Grid__
 *
 * A container for one or more `GridColumn`.
 *
 * This is the internal component, which relies on the context provided by the
 * grid wrapper.
 *
 * @internal
 */
export const Grid: ({ layout, testId, children }: GridProps) => JSX.Element = ({ layout = defaultLayout, testId, children }: GridProps) => {
	const { isNested, columns, spacing } = useContext(GridContext);

	return (
		<div
			css={[styles.grid, gridLayoutMapStyles[layout], isNested && styles.nestedGrid]}
			style={
				{
					[varColumnsNum]: columns,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					[varGridSpacing]: `${spacingMapping[spacing]}px`,
				} as React.CSSProperties
			}
			data-testid={testId}
		>
			{children}
		</div>
	);
};
