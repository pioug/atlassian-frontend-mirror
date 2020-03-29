import * as colors from '@atlaskit/theme/colors';

// The following are the name for color mappings in @atlaskit/themes
// The exports are the functions, not the objects, so could not be used here
export const disabledBackgroundColor = { light: colors.N20, dark: colors.DN20 };
// For validation red is the new 'yellow' which was { light: colors.Y300, dark: colors.Y300 }
export const invalidBorderColor = { light: colors.R400, dark: colors.R400 };

// The following do not yet have a darkmode 'map': N20A, N10
export const defaultBackgroundColor = { light: colors.N10, dark: colors.DN10 };
export const defaultBackgroundColorFocus = {
  light: colors.N0,
  dark: colors.DN10,
};
export const defaultBackgroundColorHover = {
  light: colors.N30,
  dark: colors.DN30,
};
export const defaultBorderColor = { light: colors.N40, dark: colors.DN40 };
export const defaultBorderColorFocus = { light: colors.B100, dark: colors.B75 };
export const transparent = { light: 'transparent', dark: 'transparent' };

export const textColor = { light: colors.N900, dark: colors.DN600 };
export const disabledTextColor = { light: colors.N70, dark: colors.DN90 };
export const placeholderTextColor = { light: colors.N100, dark: colors.DN90 };
