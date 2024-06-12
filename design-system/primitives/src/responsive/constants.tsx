import { token } from '@atlaskit/tokens';

import type { Breakpoint } from './types';

/**
 * Our internal configuration for breakpoints configuration.
 *
 * We explicitly use `-0.01rem` for "max" values to both ensure we do not overlap our media queries, but also don't skip any fractional pixels.  There is a chance this is not safe in some browsers, eg. Safari has weird rounding.
 * @see: https://tzi.fr/css/prevent-double-breakpoint/
 *
 * @experimental Unsafe for direct consumption outside of the design system itself; please use our `media` export instead for media queries.
 */
export const UNSAFE_BREAKPOINTS_CONFIG = {
	// mobile
	xxs: {
		gridItemGutter: token('space.200', '16px'),
		gridMargin: token('space.200', '16px'),
		min: '0rem' as const,
		max: '29.99rem' as const,
	},
	// phablet
	xs: {
		gridItemGutter: token('space.200', '16px'),
		gridMargin: token('space.200', '16px'),
		min: '30rem' as const,
		max: '47.99rem' as const,
	},
	// tablet
	sm: {
		gridItemGutter: token('space.200', '16px'),
		gridMargin: token('space.300', '24px'),
		min: '48rem' as const,
		max: '63.99rem' as const,
	},
	// laptop desktop
	md: {
		gridItemGutter: token('space.300', '24px'),
		gridMargin: token('space.400', '32px'),
		min: '64rem' as const,
		max: '89.99rem' as const,
	},
	// monitor
	lg: {
		gridItemGutter: token('space.400', '32px'),
		gridMargin: token('space.400', '32px'),
		min: '90rem' as const,
		max: '109.99rem' as const,
	},
	// large high res
	xl: {
		gridItemGutter: token('space.400', '32px'),
		gridMargin: token('space.500', '40px'),
		min: '110rem' as const,
		max: null,
	},
	// NOTE: We previously had an `xxl=135rem` breakpoint, but it was removed as it was not used anywhere and felt too large
} as const; //TODO: This `as const` should really be `satisfies Record<Breakpoint, BreakpointConfig>`, but that's not possible in our shipped TypeScript version yet.

/**
 * The list of breakpoints in order from smallest to largest.  You may need to clone and reverse this list if you want the opposite.
 *
 * This is intentional for cascading with `min-width` or `media.above`. Media queries go from lowest width to highest.
 *
 * @experimental Unsafe for consumption outside of the design system itself.
 */
export const UNSAFE_BREAKPOINTS_ORDERED_LIST = Object.keys(
	UNSAFE_BREAKPOINTS_CONFIG,
) as Breakpoint[] as ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];

/**
 * This is our smallest breakpoint with a few nuances to it:
 * 1. It is the default value for shorthands, eg. `<GridItem span={6} />` maps to `{ [SMALLEST_BREAKPOINT]: props.span }`
 * 2. It's omitted in `media.below` as there's nothing below `0px`.
 */
export const SMALLEST_BREAKPOINT = UNSAFE_BREAKPOINTS_ORDERED_LIST[0];
