import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * The breakpoints we have for responsiveness.
 */
export type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * An object type mapping a value to each breakpoint (optionally)
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
export type ResponsiveCSSObject = ResponsiveObject<ReturnType<typeof css>>;

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
   * The min-width used in media queries
   */
  min: number;
  /**
   * The max-width used in media queries
   */
  max: number;
};
