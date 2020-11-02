import {
  B100,
  B75,
  DN10,
  DN20,
  DN200,
  DN30,
  DN40,
  DN600,
  DN90,
  N0,
  N10,
  N100,
  N20,
  N30,
  N40,
  N70,
  N900,
  R400,
} from '@atlaskit/theme/colors';

// The following are the name for color mappings in @atlaskit/themes
// The exports are the functions, not the objects, so could not be used here
export const disabled = { light: N20, dark: DN20 };
// For validation red is the new 'yellow' which was { light: Y300, dark: Y300 }
export const invalidBorderColor = { light: R400, dark: R400 };

export const defaultBorderColorFocus = { light: B100, dark: B75 };
export const defaultBorderColor = { light: N40, dark: DN40 };
export const defaultBackgroundColor = { light: N10, dark: DN10 };
export const defaultBackgroundColorHover = {
  light: N30,
  dark: DN30,
};
export const defaultBackgroundColorFocus = {
  light: N0,
  dark: DN10,
};

export const placeholderTextColor = { light: N100, dark: DN200 };
export const textColor = { light: N900, dark: DN600 };
export const disabledTextColor = { light: N70, dark: DN90 };
export const transparent = { light: 'transparent', dark: 'transparent' };
