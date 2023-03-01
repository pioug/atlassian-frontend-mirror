import { token } from '@atlaskit/tokens';

import type { Breakpoint } from './types';

export type BreakpointConfig = {
  gutter: ReturnType<typeof token>;
  min: number;
  max: number;
  margin: ReturnType<typeof token>;
  columns: number;
};

export const BREAKPOINTS_CONFIG: Record<Breakpoint, BreakpointConfig> = {
  // mobile
  xs: {
    gutter: token('space.200', '16px'),
    columns: 12,
    margin: token('space.200', '16px'),
    min: 0,
    max: 591,
  },
  // tablet
  sm: {
    gutter: token('space.200', '16px'),
    columns: 12,
    margin: token('space.300', '24px'),
    min: 592,
    max: 1023,
  },
  // laptop desktop
  md: {
    gutter: token('space.300', '24px'),
    columns: 12,
    margin: token('space.400', '32px'),
    min: 1024,
    max: 1439,
  },
  // monitor
  lg: {
    gutter: token('space.400', '32px'),
    columns: 12,
    margin: token('space.400', '32px'),
    min: 1440,
    max: 1767,
  },
  // large high res
  xl: {
    gutter: token('space.400', '32px'),
    columns: 12,
    margin: token('space.500', '40px'),
    min: 1768,
    max: 2159,
  },
  // extra large high res
  xxl: {
    gutter: token('space.500', '40px'),
    columns: 12,
    margin: token('space.500', '40px'),
    min: 2160,
    max: Number.MAX_SAFE_INTEGER,
  },
} as const;

export const BREAKPOINTS_LIST = Object.keys(BREAKPOINTS_CONFIG) as [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl',
];
