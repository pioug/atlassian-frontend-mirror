import * as colors from './colors';
import themed from './utils/themed';

// Cards on a board
export const e100 = themed({
  light: `box-shadow: 0 1px 1px ${colors.N50A}, 0 0 1px 0 ${colors.N60A};`,
  dark: `box-shadow: 0 1px 1px ${colors.DN50A}, 0 0 1px ${colors.DN60A};`,
});

// Inline dialogs
export const e200 = themed({
  light: `box-shadow: 0 4px 8px -2px ${colors.N50A}, 0 0 1px ${colors.N60A};`,
  dark: `box-shadow: 0 4px 8px -2px ${colors.DN50A}, 0 0 1px ${colors.DN60A};`,
});

// Modals
export const e300 = themed({
  light: `box-shadow: 0 8px 16px -4px ${colors.N50A}, 0 0 1px ${colors.N60A};`,
  dark: `box-shadow: 0 8px 16px -4px ${colors.DN50A}, 0 0 1px ${colors.DN60A};`,
});

// Panels
export const e400 = themed({
  light: `box-shadow: 0 12px 24px -6px ${colors.N50A}, 0 0 1px ${colors.N60A};`,
  dark: `box-shadow: 0 12px 24px -6px ${colors.DN50A}, 0 0 1px ${colors.DN60A};`,
});

// Flag messages (notifications)
export const e500 = themed({
  light: `box-shadow: 0 20px 32px -8px ${colors.N50A}, 0 0 1px ${colors.N60A};`,
  dark: `box-shadow: 0 20px 32px -8px ${colors.DN50A}, 0 0 1px ${colors.DN60A};`,
});
