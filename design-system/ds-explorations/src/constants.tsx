export const LAYERS = {
  card: 100,
  navigation: 200,
  dialog: 300,
  layer: 400,
  blanket: 500,
  modal: 510,
  flag: 600,
  spotlight: 700,
  tooltip: 800,
} as const;

export type Layer = keyof typeof LAYERS;

export const BREAKPOINTS_LIST = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
export type Breakpoint = typeof BREAKPOINTS_LIST[number];

export type BreakpointConfig = {
  min: number;
  max: number;
};

export const BREAKPOINTS_CONFIG: Record<Breakpoint, BreakpointConfig> = {
  // mobile
  xs: {
    min: 0,
    max: 591,
  },
  // tablet
  sm: {
    min: 592,
    max: 1023,
  },
  // laptop desktop
  md: {
    min: 1024,
    max: 1439,
  },
  // monitor
  lg: {
    min: 1440,
    max: 1767,
  },
  // large high res
  xl: {
    min: 1768,
    max: 2159,
  },
  // extra large high res
  xxl: {
    min: 2160,
    max: Number.MAX_SAFE_INTEGER,
  },
} as const;
