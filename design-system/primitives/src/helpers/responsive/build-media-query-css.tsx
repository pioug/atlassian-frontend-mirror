import { css, CSSObject } from '@emotion/react';

import { UNSAFE_BREAKPOINTS_ORDERED_LIST } from './constants';
import { media } from './media-helper';
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
        [media.above[breakpoint]]:
          typeof input === 'function' ? input(breakpoint) : input,
      }),
    }),
    {} as Required<ResponsiveCSSObject>,
  );
};
