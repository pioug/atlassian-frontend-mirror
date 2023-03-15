import { css, CSSObject } from '@emotion/react';

import {
  SMALLEST_BREAKPOINT,
  UNSAFE_BREAKPOINTS_ORDERED_LIST,
} from './constants';
import { UNSAFE_media } from './media-helper';
import type { Breakpoint, ResponsiveCSSObject } from './types';

/**
 * Build a map of breakpoints to css with media queries and nested styles.
 *
 * @experimental Unsafe for usage as the API is not finalized.
 *
 * @example
 * A map to build optional `display:none` for consumption on a div.
 * ```ts
 * const hideMediaQueries = buildAboveMediaQueryCSS({ display: 'none' });
 *
 * const Component = ({ hideAtBreakpoints: ('xs' | 'sm')[], children: ReactNode }) => {
 *   return <div css={hideAtBreakpoints.map(b => hideMediaQueries[b])}>{children}</div>;
 * }
 * ```
 *
 * This roughly builds a map that will look roughly like this (if done manually):
 * ```ts
 * {
 *   xxs: css({ '@media (min-width: 0px)': { display: 'none' } }),
 *   xs: css({ '@media (min-width: …px)': { display: 'none' } }),
 *   sm: css({ '@media (min-width: …px)': { display: 'none' } }),
 * }
 * ```
 */
export const UNSAFE_buildAboveMediaQueryCSS = (
  /**
   * The desired CSS to place inside of the media query.
   * This can either be a css object directly or functional with `breakpoint` as the arg to return a css object.
   */
  input: CSSObject | ((breakpoint: Breakpoint) => CSSObject),
) => {
  return UNSAFE_BREAKPOINTS_ORDERED_LIST.reduce(
    (acc, breakpoint) => ({
      ...acc,
      [breakpoint]: css({
        // eslint-disable-next-line @repo/internal/styles/no-nested-styles
        [UNSAFE_media.above[breakpoint]]:
          typeof input === 'function' ? input(breakpoint) : input,
      }),
    }),
    {} as Required<ResponsiveCSSObject>,
  );
};

/**
 * Build a map of breakpoints to css with media queries and nested styles.
 *
 * WARNING: The smallest breakpoint is not a valid key as a media query below 0px is misleading.
 * This is separated from `buildAboveMediaQueryCSS` for that specific reason, you cannot have type safety with this variance.
 *
 * @experimental Unsafe for usage as the API is not finalized.
 *
 * @example
 * A map to build optional `display:none` for consumption on a div.
 * ```ts
 * const hideMediaQueries = buildBelowMediaQueryCSS({ display: 'none' });
 *
 * const Component = ({ hideAtBreakpoints: ('xs' | 'sm')[], children: ReactNode }) => {
 *   return <div css={hideAtBreakpoints.map(b => hideMediaQueries[b])}>{children}</div>;
 * }
 * ```
 *
 * This roughly builds a map that will look roughly like this (if done manually):
 * ```ts
 * {
 *   xs: css({ '@media (max-width: …px)': { display: 'none' } }),
 *   sm: css({ '@media (max-width: …px)': { display: 'none' } }),
 * }
 * ```
 *
 * @experimental Unsafe for usage as the API is not finalized.
 */
export const UNSAFE_buildBelowMediaQueryCSS = (
  /**
   * The desired CSS to place inside of the media query.
   * This can either be a css object directly or functional with `breakpoint` as the arg to return a css object.
   */
  input:
    | CSSObject
    | ((
        breakpoint: Exclude<Breakpoint, typeof SMALLEST_BREAKPOINT>,
      ) => CSSObject),
) => {
  /**
   * WARNING: it's very important that these are in the correct order.
   * If they are not, cascading is not in the order higher/low breakpoints do not override as expected.
   */
  const reversedBreakpoints = [...UNSAFE_BREAKPOINTS_ORDERED_LIST].reverse();

  return reversedBreakpoints.reduce((acc, breakpoint) => {
    // Omit `media.below.xxs` as it's not available as that would be `<0px`…
    if (breakpoint === SMALLEST_BREAKPOINT) {
      return acc;
    }

    return {
      ...acc,
      [breakpoint]: css({
        // eslint-disable-next-line @repo/internal/styles/no-nested-styles
        [UNSAFE_media.below[breakpoint]]:
          typeof input === 'function' ? input(breakpoint) : input,
      }),
    };
  }, {} as Required<Omit<ResponsiveCSSObject, typeof SMALLEST_BREAKPOINT>>);
};
