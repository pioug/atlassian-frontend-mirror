import { token } from '@atlaskit/tokens';

type GridConfig = {
  gap: ReturnType<typeof token>;
  min: number;
  max: number;
  offset: ReturnType<typeof token>;
  columns: number;
};

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const BREAKPOINTS: Record<Breakpoint, GridConfig> = {
  // mobile
  xs: {
    gap: token('space.200', '16px'),
    columns: 4,
    offset: token('space.200', '16px'),
    min: 0,
    max: 591,
  },
  // tablet
  sm: {
    gap: token('space.200', '16px'),
    columns: 6,
    offset: token('space.300', '24px'),
    min: 592,
    max: 1023,
  },
  // laptop desktop
  md: {
    gap: token('space.300', '24px'),
    columns: 12,
    offset: token('space.400', '32px'),
    min: 1024,
    max: 1439,
  },
  // monitor
  lg: {
    gap: token('space.400', '32px'),
    columns: 12,
    offset: token('space.400', '32px'),
    min: 1440,
    max: 1767,
  },
  // large high res
  xl: {
    gap: token('space.400', '32px'),
    columns: 12,
    offset: token('space.500', '40px'),
    min: 1768,
    max: 2159,
  },
  // extra large high res
  xxl: {
    gap: token('space.500', '40px'),
    columns: 12,
    offset: token('space.500', '40px'),
    min: 2160,
    max: Number.MAX_SAFE_INTEGER,
  },
} as const;
