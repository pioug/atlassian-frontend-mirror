import { token } from '@atlaskit/tokens';

import type { Breakpoint } from './types';

export type BreakpointConfig = {
  gutter: ReturnType<typeof token>;
  min: number;
  max: number;
  margin: ReturnType<typeof token>;
};

export const GRID_COLUMNS = 12 as const;

export const BREAKPOINTS_CONFIG: Record<Breakpoint, BreakpointConfig> = {
  // mobile
  xs: {
    gutter: token('space.200', '16px'),
    margin: token('space.200', '16px'),
    min: 0,
    max: 591,
  },
  // tablet
  sm: {
    gutter: token('space.200', '16px'),
    margin: token('space.300', '24px'),
    min: 592,
    max: 1023,
  },
  // laptop desktop
  md: {
    gutter: token('space.300', '24px'),
    margin: token('space.400', '32px'),
    min: 1024,
    max: 1439,
  },
  // monitor
  lg: {
    gutter: token('space.400', '32px'),
    margin: token('space.400', '32px'),
    min: 1440,
    max: 1767,
  },
  // large high res
  xl: {
    gutter: token('space.400', '32px'),
    margin: token('space.500', '40px'),
    min: 1768,
    max: 2159,
  },
  // extra large high res
  xxl: {
    gutter: token('space.500', '40px'),
    margin: token('space.500', '40px'),
    min: 2160,
    max: Number.MAX_SAFE_INTEGER,
  },
} as const;

/**
 * The list of breakpoints in order from smallest to largest.
 *
 * This is intentional for cascading with `min-width` or `media.above`. Media queries go from lowest width to highest.
 *
 * You may need to clone and reverse this list if you want the opposite.
 */
export const BREAKPOINTS_LIST = (
  Object.keys(BREAKPOINTS_CONFIG) as Breakpoint[]
).sort((a, b) => BREAKPOINTS_CONFIG[a].min - BREAKPOINTS_CONFIG[b].min) as [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
];
