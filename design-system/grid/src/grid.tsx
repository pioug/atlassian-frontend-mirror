/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { createContext, type FC, useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import { css } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { GRID_COLUMNS } from './config';
import { GridContainerContext } from './grid-container';
import type { BaseGridProps } from './types';

export type GridProps = BaseGridProps;

const baseStyles = css({
	display: 'grid',
	boxSizing: 'border-box',
	width: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
	marginInline: 'auto',
});

const gapMediaQueries = css({
	gap: token('space.200', '16px'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		gap: token('space.200', '16px'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 48rem)': {
		gap: token('space.200', '16px'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 64rem)': {
		gap: token('space.300', '24px'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 90rem)': {
		gap: token('space.400', '32px'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 110.5rem)': {
		gap: token('space.400', '32px'),
	},
});

const inlinePaddingMediaQueries = css({
	paddingInline: token('space.200', '16px'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 30rem)': {
		paddingInline: token('space.200', '16px'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 48rem)': {
		paddingInline: token('space.300', '24px'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 64rem)': {
		paddingInline: token('space.400', '32px'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 90rem)': {
		paddingInline: token('space.400', '32px'),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'@media (min-width: 110.5rem)': {
		paddingInline: token('space.500', '40px'),
	},
});

const gridMaxWidthMap = cssMap({
	wide: { maxWidth: '70.5rem' },
	narrow: { maxWidth: '46.5rem' },
});

const GridContext = createContext(false);

/**
 * __Grid__
 *
 * A grid is a responsive layout component designed to manage the content of a page.
 *
 * - [Code](https://atlassian.design/components/grid)
 *
 * @example
 * ```jsx
 * import Grid, { GridItem } from '@atlaskit/grid';
 *
 * const App = () => (
 *   <Grid>
 *     <GridItem></GridItem>
 *   </Grid>
 * );
 * ```
 */
export const Grid: FC<GridProps> = ({ testId, children, maxWidth, hasInlinePadding }) => {
	const isNested = useContext(GridContext);
	const isWithinContainer = useContext(GridContainerContext);
	// while not within a GridContainer hasInlinePadding either undefined or true means setting the padding on by default
	const showInlinePadding = hasInlinePadding !== false;

	invariant(
		!isNested,
		'@atlaskit/grid: Nesting grids are not supported at this time, please only use a top-level grid or leverage GridContainer.',
	);

	return (
		<div
			data-testid={testId}
			css={[
				baseStyles,
				gapMediaQueries,
				!isWithinContainer && maxWidth && gridMaxWidthMap[maxWidth],
				!isWithinContainer && showInlinePadding && inlinePaddingMediaQueries,
			]}
		>
			<GridContext.Provider value={true}>{children}</GridContext.Provider>
		</div>
	);
};
