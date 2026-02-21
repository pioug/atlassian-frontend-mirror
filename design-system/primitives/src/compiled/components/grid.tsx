/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ElementType,
	forwardRef,
	type ForwardRefExoticComponent,
	memo,
	type MemoExoticComponent,
	type ReactNode,
	type Ref,
	type RefAttributes,
} from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import type {
	AlignContent,
	AlignItems,
	AutoFlow,
	BasePrimitiveProps,
	GapToken,
	JustifyContent,
	JustifyItems,
} from './types';

export type GridProps<T extends ElementType = 'div'> = {
	/**
	 * The DOM element to render as the Flex. Defaults to `div`.
	 */
	as?: 'div' | 'span' | 'ul' | 'ol';

	/**
	 * Used to align children along the inline axis.
	 */
	justifyContent?: JustifyContent;

	/**
	 * Used to align the grid along the inline axis.
	 *
	 * @deprecated This prop is not hooked up and doesn't nothing!
	 */
	justifyItems?: JustifyItems;

	/**
	 * Used to align children along the block axis.
	 */
	alignItems?: AlignItems;

	/**
	 * Used to align the grid along the block axis.
	 */
	alignContent?: AlignContent;

	/**
	 * Represents the space between each column.
	 */
	columnGap?: GapToken;

	/**
	 * Represents the space between each child across both axes.
	 */
	gap?: GapToken;

	/**
	 * Represents the space between each row.
	 */
	rowGap?: GapToken;

	/**
	 * Specifies how auto-placed items get flowed into the grid. CSS `grid-auto-flow`.
	 */
	autoFlow?: AutoFlow;

	/**
	 * Elements to be rendered inside the grid. Required as a grid without children should not be a grid.
	 */
	children: ReactNode;

	/**
	 * HTML id attrubute.
	 */
	id?: string;

	/**
	 * Forwarded ref element.
	 */
	ref?: React.ComponentPropsWithRef<T>['ref'];
} & BasePrimitiveProps;

const rowGapMap = cssMap({
	'space.0': { rowGap: token('space.0', '0px') },
	'space.025': { rowGap: token('space.025', '2px') },
	'space.050': { rowGap: token('space.050', '4px') },
	'space.075': { rowGap: token('space.075', '6px') },
	'space.100': { rowGap: token('space.100', '8px') },
	'space.150': { rowGap: token('space.150', '12px') },
	'space.200': { rowGap: token('space.200', '16px') },
	'space.250': { rowGap: token('space.250', '20px') },
	'space.300': { rowGap: token('space.300', '24px') },
	'space.400': { rowGap: token('space.400', '32px') },
	'space.500': { rowGap: token('space.500', '40px') },
	'space.600': { rowGap: token('space.600', '48px') },
	'space.800': { rowGap: token('space.800', '64px') },
	'space.1000': { rowGap: token('space.1000', '80px') },
});

const columnGapMap = cssMap({
	'space.0': { columnGap: token('space.0', '0px') },
	'space.025': { columnGap: token('space.025', '2px') },
	'space.050': { columnGap: token('space.050', '4px') },
	'space.075': { columnGap: token('space.075', '6px') },
	'space.100': { columnGap: token('space.100', '8px') },
	'space.150': { columnGap: token('space.150', '12px') },
	'space.200': { columnGap: token('space.200', '16px') },
	'space.250': { columnGap: token('space.250', '20px') },
	'space.300': { columnGap: token('space.300', '24px') },
	'space.400': { columnGap: token('space.400', '32px') },
	'space.500': { columnGap: token('space.500', '40px') },
	'space.600': { columnGap: token('space.600', '48px') },
	'space.800': { columnGap: token('space.800', '64px') },
	'space.1000': { columnGap: token('space.1000', '80px') },
});

const justifyContentMap = cssMap({
	start: { justifyContent: 'start' },
	center: { justifyContent: 'center' },
	end: { justifyContent: 'end' },
	'space-between': { justifyContent: 'space-between' },
	'space-around': { justifyContent: 'space-around' },
	'space-evenly': { justifyContent: 'space-evenly' },
	stretch: { justifyContent: 'stretch' },
});

const alignContentMap = cssMap({
	start: { alignContent: 'start' },
	center: { alignContent: 'center' },
	end: { alignContent: 'end' },
	'space-between': { alignContent: 'space-between' },
	'space-around': { alignContent: 'space-around' },
	'space-evenly': { alignContent: 'space-evenly' },
	stretch: { alignContent: 'stretch' },
});

const alignItemsMap = cssMap({
	start: { alignItems: 'start' },
	center: { alignItems: 'center' },
	baseline: { alignItems: 'baseline' },
	end: { alignItems: 'end' },
	stretch: { alignItems: 'stretch' },
});

const baseStyles = cssMap({
	root: {
		display: 'grid',
		boxSizing: 'border-box',
	},
});

const gridAutoFlowMap = cssMap({
	row: { gridAutoFlow: 'row' },
	column: { gridAutoFlow: 'column' },
	dense: { gridAutoFlow: 'dense' },
	'row dense': { gridAutoFlow: 'row dense' },
	'column dense': { gridAutoFlow: 'column dense' },
});

/**
 * __Grid__
 *
 * `Grid` is a primitive component that implements the CSS Grid API.
 *
 * - [Examples](https://atlassian.design/components/primitives/grid/examples)
 * - [Code](https://atlassian.design/components/primitives/grid/code)
 *
 * @example
 * ```tsx
 * import { Grid, Box } from '@atlaskit/primitives'
 *
 * const Component = () => (
 *   <Grid gap="space.100" gridColumns="1fr 1fr">
 *     <Box padding="space.100" backgroundColor="neutral"></Box>
 *     <Box padding="space.100" backgroundColor="neutral"></Box>
 *   </Grid>
 * )
 * ```
 */
const Grid: MemoExoticComponent<
	ForwardRefExoticComponent<Omit<GridProps<ElementType>, 'ref'> & RefAttributes<any>>
> = memo(
	forwardRef(
		<T extends ElementType = 'div'>(
			{
				as,
				alignItems,
				alignContent,
				justifyContent,
				gap,
				columnGap,
				rowGap,
				children,
				id,
				role,
				testId,
				autoFlow,
				xcss,
			}: GridProps<T>,
			ref: Ref<any>,
		) => {
			const Component = as || 'div';

			return (
				<Component
					id={id}
					role={role}
					className={xcss}
					css={[
						baseStyles.root,
						// NOTE: "columnGap" or "rowGap" must override "gap"
						gap && columnGapMap[gap],
						columnGap && columnGapMap[columnGap],
						gap && rowGapMap[gap],
						rowGap && rowGapMap[rowGap],
						alignItems && alignItemsMap[alignItems],
						alignContent && alignContentMap[alignContent],
						justifyContent && justifyContentMap[justifyContent],
						autoFlow && gridAutoFlowMap[autoFlow],
					]}
					data-testid={testId}
					ref={ref}
				>
					{children}
				</Component>
			);
		},
	),
);

Grid.displayName = 'Grid';

export default Grid;
