import { token } from '@atlaskit/tokens';

import type { Breakpoint, BreakpointConfig } from './types';

/**
 * Our internal configuration for breakpoints configuration.
 *
 * @experimental Unsafe for consumption outside of the design system itself.
 */
export const UNSAFE_BREAKPOINTS_CONFIG: Record<Breakpoint, BreakpointConfig> = {
  // mobile
  xxs: {
    gridItemGutter: token('space.200', '16px'),
    gridMargin: token('space.200', '16px'),
    min: 0,
    max: 479,
  },
  // phablet
  xs: {
    gridItemGutter: token('space.200', '16px'),
    gridMargin: token('space.200', '16px'),
    min: 480,
    max: 767,
  },
  // tablet
  sm: {
    gridItemGutter: token('space.200', '16px'),
    gridMargin: token('space.300', '24px'),
    min: 768,
    max: 1023,
  },
  // laptop desktop
  md: {
    gridItemGutter: token('space.300', '24px'),
    gridMargin: token('space.400', '32px'),
    min: 1024,
    max: 1439,
  },
  // monitor
  lg: {
    gridItemGutter: token('space.400', '32px'),
    gridMargin: token('space.400', '32px'),
    min: 1440,
    max: 1767,
  },
  // large high res
  xl: {
    gridItemGutter: token('space.400', '32px'),
    gridMargin: token('space.500', '40px'),
    min: 1768,
    max: 2159,
  },
  // extra large high res
  xxl: {
    gridItemGutter: token('space.500', '40px'),
    gridMargin: token('space.500', '40px'),
    min: 2160,
    max: Number.MAX_SAFE_INTEGER,
  },
} as const;

/**
 * The list of breakpoints in order from smallest to largest.  You may need to clone and reverse this list if you want the opposite.
 *
 * This is intentional for cascading with `min-width` or `media.above`. Media queries go from lowest width to highest.
 *
 * @experimental Unsafe for consumption outside of the design system itself.
 */
export const UNSAFE_BREAKPOINTS_ORDERED_LIST = (
  Object.keys(UNSAFE_BREAKPOINTS_CONFIG) as Breakpoint[]
).sort(
  (a, b) => UNSAFE_BREAKPOINTS_CONFIG[a].min - UNSAFE_BREAKPOINTS_CONFIG[b].min,
) as ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

/**
 * This is our smallest breakpoint with a few nuances to it:
 * 1. It is the default value for shorthands, eg. `<GridItem span={6} />` maps to `{ [SMALLEST_BREAKPOINT]: props.span }`
 * 2. It's omitted in `media.below` as there's nothing below `0px`.
 *
 * @experimental There's a chance this will change in _value_, but should only be used in a way that it will not matter if this value changes.
 */
export const SMALLEST_BREAKPOINT = UNSAFE_BREAKPOINTS_ORDERED_LIST[0];
