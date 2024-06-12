import { type SerializedStyles } from '@emotion/react';

import { type token } from '@atlaskit/tokens';

import { type media } from './media-helper';

/**
 * The breakpoints we have for responsiveness.
 */
export type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * All supported media queries for use as keys, eg. in `xcss({ [MediaQuery]: { … } })`.
 *
 * TODO: Should this have `media.above.xxs`?  This is explicitly `@media all`, which I believe is just additional specificity (which could lead to some mistakes)
 */
export type MediaQuery = (typeof media.above)[Breakpoint];

/**
 * An object type mapping a value to each breakpoint (optionally).
 */
export type ResponsiveObject<T> = Partial<Record<Breakpoint, T>>;

/**
 * A map of breakpoints to CSS, commonly used to build maps given a responsive object
 * so we can statically compile CSS upfront, but dynamically apply it.
 *
 * @example Here we could conditionally load margins based a `setMarginBreakpoints={['xs', 'md']}` type prop.
 * ```tsx
 * const marginMediaQueries = {
 *   xxs: css({ [media.above.xxs]: margin: 0 } }),
 *   xs: css({ [media.above.xs]: margin: 4 } }),
 *   //…
 * }
 *
 * return <div css={setMarginBreakpoints.map(breakpoint => marginMediaQueries[breakpoint])} />
 * ```
 */
export type ResponsiveCSSObject = ResponsiveObject<SerializedStyles>;

/**
 * Our internal breakpoint config used to build media queries and define attributes for certain components.
 */
export type BreakpointConfig = {
	/**
	 * The gap between a `GridItem`.
	 */
	gridItemGutter: ReturnType<typeof token>;
	/**
	 * The outer whitespace of a `Grid` item.
	 */
	gridMargin: ReturnType<typeof token>;
	/**
	 * The min-width used in media queries.
	 */
	min: `${number}rem`;
	/**
	 * The max-width used in media queries; if set to `null`, it has no max-width (should strictly only be on the largest breakpoint).
	 */
	max: `${number}rem` | null;
};
