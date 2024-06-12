/* eslint-disable jsdoc/require-asterisk-prefix */
type GridLayout = 'fluid' | 'fixed';

type BaseGridProps = {
	/**
	 * The content of the grid. Direct children should be instances of `GridColumn`.
	 *
	 */
	children?: React.ReactNode;
	/**
	 * Controls whether the grid should use a fixed-width layout or expand to fill available space.
	 * Defaults to `"fixed"`.
	 */
	layout?: GridLayout;
	/**
	 * A unique string that appears as a data attribute `data-testid` in the rendered code. Serves as a hook for automated tests.
	 */
	testId?: string;
};

type GridSpacing = 'cosy' | 'comfortable' | 'compact';

type GridProps = BaseGridProps & {
	/**
	 * The amount of space between each grid column.
	 * `comfortable` adds 40px of spacing, `cosy` adds 16px and `compact` creates 4px gap between columns.
	 * Defaults to `"cosy"`.
	 */
	spacing?: GridSpacing;
	/**
	 * The total number of columns available in each row of the grid.
	 * Defaults to `12`.
	 */
	columns?: number;
};
/* eslint-enable jsdoc/require-asterisk-prefix */

export default function _(__: GridProps) {
	return null;
}
