import { SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { UNSAFE_media } from './media-helper';

/**
 * The breakpoints we have for responsiveness.
 */
export type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type MediaQuery =
  | (typeof UNSAFE_media.above)[Breakpoint]
  | (typeof UNSAFE_media.below)[Exclude<Breakpoint, 'xxs'>];

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
   * The min-width used in media queries
   */
  min: `${number}rem`;
  /**
   * The max-width used in media queries
   */
  max: `${number}rem`;
  /**
   * To ensure min-width and max-width do both target at the same time, we subtract a value.
   * We use a fractional value here as used in other libraries and described in @link https://www.w3.org/TR/mediaqueries-4/#mq-min-max: "…possibility of fractional viewport sizes which can occur as a result of non-integer pixel densities…"
   */
  below: `${number}rem`;
};
