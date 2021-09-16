import { DN40A, DN50A, DN60A, N40A, N50A, N60A } from './colors';
import themed from './utils/themed';

// Cards on a board
export const e100 = themed({
  light: `box-shadow: 0 1px 1px ${N50A}, 0 0 1px 1px ${N40A};`,
  dark: `box-shadow: 0 1px 1px ${DN50A}, 0 0 1px 1px ${DN40A};`,
});

// Inline dialogs
export const e200 = themed({
  light: `box-shadow: 0 4px 8px -2px ${N50A}, 0 0 1px ${N60A};`,
  dark: `box-shadow: 0 4px 8px -2px ${DN50A}, 0 0 1px ${DN60A};`,
});

// Modals
export const e300 = themed({
  light: `box-shadow: 0 8px 16px -4px ${N50A}, 0 0 1px ${N60A};`,
  dark: `box-shadow: 0 8px 16px -4px ${DN50A}, 0 0 1px ${DN60A};`,
});

// Panels
export const e400 = themed({
  light: `box-shadow: 0 12px 24px -6px ${N50A}, 0 0 1px ${N60A};`,
  dark: `box-shadow: 0 12px 24px -6px ${DN50A}, 0 0 1px ${DN60A};`,
});

// Flag messages (notifications)
export const e500 = themed({
  light: `box-shadow: 0 20px 32px -8px ${N50A}, 0 0 1px ${N60A};`,
  dark: `box-shadow: 0 20px 32px -8px ${DN50A}, 0 0 1px ${DN60A};`,
});
