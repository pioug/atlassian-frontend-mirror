/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type ElementType,
	forwardRef,
	memo,
	type ReactNode,
	type Ref,
	useMemo,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { type Space, spaceStylesMap } from '../xcss/style-maps.partial';
import { parseXcss } from '../xcss/xcss';

import type { BasePrimitiveProps } from './types';

export type GridProps<T extends ElementType = 'div'> = {
	/**
	 * The DOM element to render as the Grid. Defaults to `div`.
	 */
	as?: 'div' | 'span' | 'ul' | 'ol';

	/**
	 * Used to align children along the inline axis.
	 */
	justifyContent?: JustifyContent;

	/**
	 * Used to align the grid along the inline axis.
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
	columnGap?: Space;

	/**
	 * Represents the space between each child across both axes.
	 */
	gap?: Space;

	/**
	 * Represents the space between each row.
	 */
	rowGap?: Space;

	/**
	 * Specifies how auto-placed items get flowed into the grid. CSS `grid-auto-flow`.
	 */
	autoFlow?: AutoFlow;

	/**
	 * CSS `grid-template-rows`.
	 */
	templateRows?: string;

	/**
	 * CSS `grid-template-columns`.
	 */
	templateColumns?: string;

	/**
	 * CSS `grid-template-areas`.
	 *
	 * Each item in the passed array is a grid row.
	 */
	templateAreas?: string[];

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

type JustifyContent = keyof typeof justifyContentMap;
type JustifyItems = keyof typeof justifyItemsMap;
type AlignItems = keyof typeof alignItemsMap;
type AlignContent = keyof typeof alignContentMap;

const gridTemplateAreasVar = '--ds-grid--grid-template-areas';
const gridTemplateColumnsVar = '--ds-grid--grid-template-columns';
const gridTemplateRowsVar = '--ds-grid--grid-template-rows';

const justifyContentMap = {
	start: css({ justifyContent: 'start' }),
	center: css({ justifyContent: 'center' }),
	end: css({ justifyContent: 'end' }),
	'space-between': css({ justifyContent: 'space-between' }),
	'space-around': css({ justifyContent: 'space-around' }),
	'space-evenly': css({ justifyContent: 'space-evenly' }),
	stretch: css({ justifyContent: 'stretch' }),
} as const;

const justifyItemsMap = {
	start: css({ justifyItems: 'start' }),
	center: css({ justifyItems: 'center' }),
	end: css({ justifyItems: 'end' }),
	stretch: css({ justifyItems: 'stretch' }),
} as const;

const alignContentMap = {
	start: css({ alignContent: 'start' }),
	center: css({ alignContent: 'center' }),
	end: css({ alignContent: 'end' }),
	'space-between': css({ alignContent: 'space-between' }),
	'space-around': css({ alignContent: 'space-around' }),
	'space-evenly': css({ alignContent: 'space-evenly' }),
	stretch: css({ alignContent: 'stretch' }),
} as const;

const alignItemsMap = {
	start: css({ alignItems: 'start' }),
	center: css({ alignItems: 'center' }),
	baseline: css({ alignItems: 'baseline' }),
	end: css({ alignItems: 'end' }),
} as const;

const baseStyles = css({
	display: 'grid',
	boxSizing: 'border-box',
	gridTemplateAreas: `var(${gridTemplateAreasVar})`,
	gridTemplateColumns: `var(${gridTemplateColumnsVar})`,
	gridTemplateRows: `var(${gridTemplateRowsVar})`,
});

type AutoFlow = keyof typeof gridAutoFlowMap;

const gridAutoFlowMap = {
	row: css({ gridAutoFlow: 'row' }),
	column: css({ gridAutoFlow: 'column' }),
	dense: css({ gridAutoFlow: 'dense' }),
	'row dense': css({ gridAutoFlow: 'row dense' }),
	'column dense': css({ gridAutoFlow: 'column dense' }),
} as const;

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
 * // eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
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
const Grid = memo(
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
				templateAreas: gridTemplateAreas,
				templateRows: gridTemplateRows,
				templateColumns: gridTemplateColumns,
				xcss,
			}: GridProps<T>,
			ref: Ref<any>,
		) => {
			const Component = as || 'div';
			const resolvedStyles = parseXcss(xcss);

			/**
			 * We use CSS variables to allow for dynamic grid templates instead of dynamically setting to `props.style`
			 * This allows `props.xcss` to override them as `style={{ gridTemplateAreas }}` would have higher specificity.
			 *
			 * This must be reset to `initial` if `gridTemplateAreas` is not set, otherwise nested grids will break!
			 *
			 * NOTE: If we disallow `grid-template-areas` (etc) to be set via `props.xcss`, we can remove this.
			 */
			const style: CSSProperties | undefined = useMemo(
				() =>
					({
						[gridTemplateAreasVar]: gridTemplateAreas
							? gridTemplateAreas.map((str) => `"${str}"`).join('\n') || 'initial'
							: 'initial',
						[gridTemplateColumnsVar]: gridTemplateColumns || 'initial',
						[gridTemplateRowsVar]: gridTemplateRows || 'initial',
					}) as CSSProperties,
				[gridTemplateAreas, gridTemplateColumns, gridTemplateRows],
			);

			return (
				<Component
					id={id}
					role={role}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={style}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={resolvedStyles.static}
					css={[
						baseStyles,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						gap && spaceStylesMap.gap[gap],
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						columnGap && spaceStylesMap.columnGap[columnGap],
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						rowGap && spaceStylesMap.rowGap[rowGap],
						alignItems && alignItemsMap[alignItems],
						alignContent && alignContentMap[alignContent],
						justifyContent && justifyContentMap[justifyContent],
						autoFlow && gridAutoFlowMap[autoFlow],
						resolvedStyles.emotion,
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
