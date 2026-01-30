/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { createContext, type FC } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { css } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import type { BaseGridProps } from './types';

const containerBaseStyles = css({
	display: 'grid',
	boxSizing: 'border-box',
	width: '100%',
	gridTemplateColumns: `1fr`,
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

/**
 * __Grid container context__
 *
 * A grid container context used to detect to detect wether a component is inside a grid container.
 *
 */
export const GridContainerContext: import("react").Context<boolean> = createContext(false);

/**
 * __GridContainer__
 *
 * A grid container is a grid with one column whith the purpose of stacking grids on top of each other
 * while maintaining the responsive gaps between grids
 * - [Code](https://atlassian.design/components/grid-container)
 *
 * @example
 * ```jsx
 * import Grid, { GridItem, GridContainer } from '@atlaskit/grid';
 *
 * const App = () => (
 *  <GridContainer>
 *    <Grid>
 *      <GridItem></GridItem>
 *    </Grid>
 *    <Grid>
 *      <GridItem></GridItem>
 *    </Grid>
 *  <GridContainer>
 * );
 * ```
 */
export const GridContainer: FC<BaseGridProps> = ({
	testId,
	children,
	maxWidth,
	hasInlinePadding = true,
}) => {
	return (
		<div
			data-testid={testId}
			css={[
				containerBaseStyles,
				gapMediaQueries,
				maxWidth && gridMaxWidthMap[maxWidth],
				hasInlinePadding && inlinePaddingMediaQueries,
			]}
		>
			<GridContainerContext.Provider value={true}>{children}</GridContainerContext.Provider>
		</div>
	);
};
