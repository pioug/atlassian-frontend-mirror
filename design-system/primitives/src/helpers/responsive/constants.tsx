import { token } from '@atlaskit/tokens';

import type { Breakpoint, BreakpointConfig } from './types';

/**
 * Our internal configuration for breakpoints configuration.
 *
 * These are `rem` based multiples.
 *
 * @experimental Unsafe for consumption outside of the design system itself.
 */
export const UNSAFE_BREAKPOINTS_CONFIG: Record<Breakpoint, BreakpointConfig> = {
  // mobile
  xxs: {
    gridItemGutter: token('space.200', '16px'),
    gridMargin: token('space.200', '16px'),
    below: '0rem',
    min: '0rem',
    max: '29.998rem',
  },
  // phablet
  xs: {
    gridItemGutter: token('space.200', '16px'),
    gridMargin: token('space.200', '16px'),
    below: '29.998rem',
    min: '30rem',
    max: '47.998rem',
  },
  // tablet
  sm: {
    gridItemGutter: token('space.200', '16px'),
    gridMargin: token('space.300', '24px'),
    below: '47.998rem',
    min: '48rem',
    max: '63.998rem',
  },
  // laptop desktop
  md: {
    gridItemGutter: token('space.300', '24px'),
    gridMargin: token('space.400', '32px'),
    below: '63.998rem',
    min: '64rem',
    max: '89.998rem',
  },
  // monitor
  lg: {
    gridItemGutter: token('space.400', '32px'),
    gridMargin: token('space.400', '32px'),
    below: '89.998rem',
    min: '90rem',
    max: '109.998rem',
  },
  // large high res
  xl: {
    gridItemGutter: token('space.400', '32px'),
    gridMargin: token('space.500', '40px'),
    below: '109.998rem',
    min: '110rem',
    max: '134.998rem',
  },
  // extra large high res
  xxl: {
    gridItemGutter: token('space.500', '40px'),
    gridMargin: token('space.500', '40px'),
    below: '134.998rem',
    min: '135rem',
    max: `${Number.MAX_SAFE_INTEGER}rem`,
  },
} as const;

/**
 * The list of breakpoints in order from smallest to largest.  You may need to clone and reverse this list if you want the opposite.
 *
 * This is intentional for cascading with `min-width` or `media.above`. Media queries go from lowest width to highest.
 *
 * @experimental Unsafe for consumption outside of the design system itself.
 */
export const UNSAFE_BREAKPOINTS_ORDERED_LIST = Object.keys(
  UNSAFE_BREAKPOINTS_CONFIG,
) as Breakpoint[] as ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

/**
 * This is our smallest breakpoint with a few nuances to it:
 * 1. It is the default value for shorthands, eg. `<GridItem span={6} />` maps to `{ [SMALLEST_BREAKPOINT]: props.span }`
 * 2. It's omitted in `media.below` as there's nothing below `0px`.
 *
 * @experimental There's a chance this will change in _value_, but should only be used in a way that it will not matter if this value changes.
 */
export const SMALLEST_BREAKPOINT = UNSAFE_BREAKPOINTS_ORDERED_LIST[0];
