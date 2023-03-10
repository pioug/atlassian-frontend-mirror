import {
  UNSAFE_Breakpoint as Breakpoint,
  UNSAFE_BreakpointConfig as BreakpointConfig,
  UNSAFE_BREAKPOINTS_CONFIG as BREAKPOINTS_CONFIG,
  UNSAFE_BREAKPOINTS_LIST as BREAKPOINTS_LIST,
} from '@atlaskit/ds-explorations';

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

export {
  BREAKPOINTS_CONFIG,
  BREAKPOINTS_LIST,
  type Breakpoint,
  type BreakpointConfig,
};
