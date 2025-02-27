// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type SerializedStyles } from '@emotion/react';

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
