/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type FC, useMemo } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { type Breakpoint, type ResponsiveObject } from '@atlaskit/primitives/responsive';

import { GRID_COLUMNS } from './config';
import type { GridItemProps, SpanObject, StartObject } from './types';

// when in doubt simply span all columns
const baseGridItemStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gridColumn: `1 / span ${GRID_COLUMNS}`,
});

const hideMediaQueries = cssMap({
	xxs: {
		display: 'none',
	},
	xs: {
		'@media (min-width: 30rem)': {
			display: 'none',
		},
	},
	sm: {
		'@media (min-width: 48rem)': {
			display: 'none',
		},
	},
	md: {
		'@media (min-width: 64rem)': {
			display: 'none',
		},
	},
	lg: {
		'@media (min-width: 90rem)': {
			display: 'none',
		},
	},
	xl: {
		'@media (min-width: 110.5rem)': {
			display: 'none',
		},
	},
});
const gridSpanMediaQueries = cssMap({
	xxs: {
		// all screens
		display: 'block', // override the display that might be cascaded in from `hideMediaQueries`
		gridColumnEnd: `span var(--grid-item-xxs-span, 12)`,
	},
	xs: {
		'@media (min-width: 30rem)': {
			display: 'block', // override the display that might be cascaded in from `hideMediaQueries`
			gridColumnEnd: `span var(--grid-item-xs-span, 12)`,
		},
	},
	sm: {
		'@media (min-width: 48rem)': {
			display: 'block', // override the display that might be cascaded in from `hideMediaQueries`
			gridColumnEnd: `span var(--grid-item-sm-span, 12)`,
		},
	},
	md: {
		'@media (min-width: 64rem)': {
			display: 'block', // override the display that might be cascaded in from `hideMediaQueries`
			gridColumnEnd: `span var(--grid-item-md-span, 12)`,
		},
	},
	lg: {
		'@media (min-width: 90rem)': {
			display: 'block', // override the display that might be cascaded in from `hideMediaQueries`
			gridColumnEnd: `span var(--grid-item-lg-span, 12)`,
		},
	},
	xl: {
		'@media (min-width: 110.5rem)': {
			display: 'block', // override the display that might be cascaded in from `hideMediaQueries`
			gridColumnEnd: `span var(--grid-item-xl-span, 12)`,
		},
	},
});
const gridStartMediaQueries = cssMap({
	xxs: {
		// all screens
		gridColumnStart: `var(--grid-item-xxs-start, 'auto')`,
	},
	xs: {
		'@media (min-width: 30rem)': {
			gridColumnStart: `var(--grid-item-xs-start, 'auto')`,
		},
	},
	sm: {
		'@media (min-width: 48rem)': {
			gridColumnStart: `var(--grid-item-sm-start, 'auto')`,
		},
	},
	md: {
		'@media (min-width: 64rem)': {
			gridColumnStart: `var(--grid-item-md-start, 'auto')`,
		},
	},
	lg: {
		'@media (min-width: 90rem)': {
			gridColumnStart: `var(--grid-item-lg-start, 'auto')`,
		},
	},
	xl: {
		'@media (min-width: 110.5rem)': {
			gridColumnStart: `var(--grid-item-xl-start, 'auto')`,
		},
	},
});

/**
 * Build a set of responsive css variables given a responsive object
 * to be set via `props.style`
 */
function buildCSSVarsFromConfig<
	T extends ResponsiveObject<any> = SpanObject | StartObject,
	K extends string = 'start' | 'span',
>({
	responsiveObject,
	key,
	prefix,
	isValidBreakpointValue = () => true,
}: {
	responsiveObject: T;
	key: K;
	prefix: string;
	/**
	 * Is the value valid to assign to a CSS variable?  We have scenarios where the value should not map across into a CSS Var.
	 *
	 * By default this is not required as regardless of this check, `undefined` values are always treated as invalid and ignored.
	 *
	 * @example
	 * `span="none"` should not exist as `grid-column-end: span none` is invalid
	 * ```ts
	 * buildCSSVarsFromConfig(
	 *   { xxs: 'none', md: 6 },
	 *   'span',
	 *   (value) => value !== 'none'`
	 * )
	 * ```
	 */
	isValidBreakpointValue?: (value: T[Breakpoint]) => boolean;
}): CSSProperties {
	/**
	 * This coerces an object of `{ xxs: 12, sm: 'auto', … }` down to `[['xxs', 12], ['sm', 'auto], …]`.  Split out for readability.
	 */
	const entries = Object.entries(responsiveObject) as [keyof T, T[keyof T]][];

	return entries.reduce((acc, [breakpoint, value]) => {
		if (typeof value === 'undefined' || !isValidBreakpointValue(value)) {
			return acc;
		}

		return {
			...acc,
			[`--${prefix}-${String(breakpoint)}-${key}` as const]: value,
		};
	}, {});
}

/**test
 * __Grid item__
 *
 * A grid item is designed to be nested in a `Grid`. Grid items can span one or many columns.
 *
 * - [Code](https://atlassian.design/components/grid)
 *
 * @example
 * ```jsx
 * import Grid, { GridItem } from '@atlaskit/grid';
 *
 * const App = () => (
 *   <Grid>
 *     <GridItem span="6">half-width content</GridItem>
 *     <GridItem span="6">half-width content</GridItem>
 *   </Grid>
 * );
 * ```
 */
export const GridItem: FC<GridItemProps> = ({
	testId,
	children,
	start: startProp = 'auto',
	span: spanProp = 12,
}) => {
	// If `prop` isn't a responsive object, we set the value against the `xs` breakpoint, eg. `span={6}` is the same as `span={{ xxs: 6 }}`
	const span: SpanObject = typeof spanProp === 'object' ? spanProp : { xxs: spanProp };
	const spanDependencyComparison = JSON.stringify(span); // to compare `span` changes in a `useMemo` deps array (used a few times)
	const spanStyles = useMemo(
		() =>
			buildCSSVarsFromConfig({
				responsiveObject: span,
				key: 'span',
				prefix: 'grid-item',
				// We don't want a css var like `--grid-item-xs-span: none` as it's invalid and unused.
				isValidBreakpointValue: (value) => value !== 'none',
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- `span` will change references easily, but we still need to allow content or key changes to update
		[spanDependencyComparison],
	);

	// If `prop` isn't a responsive object, we set the value against the `xs` breakpoint, eg. `start={6}` is the same as `start={{ xxs: 6 }}`
	const start: StartObject = typeof startProp === 'object' ? startProp : { xxs: startProp };
	const startDependencyComparison = JSON.stringify(start); // to compare `start` changes in a `useMemo` deps array (used a few times)
	const startStyles = useMemo(
		() =>
			buildCSSVarsFromConfig({
				responsiveObject: start,
				key: 'start',
				prefix: 'grid-item',
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- `start` will change references easily, but we still need to allow content or key changes to update
		[startDependencyComparison],
	);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ ...startStyles, ...spanStyles }}
			css={[
				baseGridItemStyles,
				span.xxs && span.xxs === 'none' && hideMediaQueries.xxs,
				span.xxs && span.xxs !== 'none' && gridSpanMediaQueries.xxs,
				start.xxs && gridStartMediaQueries.xxs,
				span.xs && span.xs === 'none' && hideMediaQueries.xs,
				span.xs && span.xs !== 'none' && gridSpanMediaQueries.xs,
				start.xs && gridStartMediaQueries.xs,
				span.sm && span.sm === 'none' && hideMediaQueries.sm,
				span.sm && span.sm !== 'none' && gridSpanMediaQueries.sm,
				start.sm && gridStartMediaQueries.sm,
				span.md && span.md === 'none' && hideMediaQueries.md,
				span.md && span.md !== 'none' && gridSpanMediaQueries.md,
				start.md && gridStartMediaQueries.md,
				span.lg && span.lg === 'none' && hideMediaQueries.lg,
				span.lg && span.lg !== 'none' && gridSpanMediaQueries.lg,
				start.lg && gridStartMediaQueries.lg,
				span.xl && span.xl === 'none' && hideMediaQueries.xl,
				span.xl && span.xl !== 'none' && gridSpanMediaQueries.xl,
				start.xl && gridStartMediaQueries.xl,
			]}
			data-testid={testId}
		>
			{children}
		</div>
	);
};
