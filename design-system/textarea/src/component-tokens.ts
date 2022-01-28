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
import { token } from '@atlaskit/tokens';

export const disabledBackground = {
  light: token('color.background.disabled', N20),
  dark: token('color.background.disabled', DN20),
};
export const disabledBorder = {
  light: token('color.background.disabled', N40),
  dark: token('color.background.disabled', DN40),
};

export const invalidBorderColor = {
  light: token('color.border.danger', R400),
  dark: token('color.border.danger', R400),
};

export const defaultBorderColor = {
  light: token('color.border', N40),
  dark: token('color.border', DN40),
};
export const defaultBorderColorFocus = {
  light: token('color.border.focused', B100),
  dark: token('color.border.focused', B75),
};

export const defaultBackgroundColor = {
  light: token('color.background.neutral', N10),
  dark: token('color.background.neutral', DN10),
};
export const defaultBackgroundColorHover = {
  light: token('elevation.surface', N30),
  dark: token('elevation.surface', DN30),
};
export const defaultBackgroundColorFocus = {
  light: token('elevation.surface', N0),
  dark: token('elevation.surface', DN10),
};

// TODO Subtle hover styles not defined in Figma: https://product-fabric.atlassian.net/browse/DSP-1568
export const subtleHoverBackgroundColor = {
  light: token('color.background.neutral.subtle.hovered', N30),
  dark: token('color.background.neutral.subtle.hovered', DN30),
};

export const placeholderTextColor = {
  light: token('color.text.subtlest', N100),
  dark: token('color.text.subtlest', DN200),
};
export const textColor = {
  light: token('color.text', N900),
  dark: token('color.text', DN600),
};
export const disabledTextColor = {
  light: token('color.text.disabled', N70),
  dark: token('color.text.disabled', DN90),
};
export const transparent = {
  light: 'transparent',
  dark: 'transparent',
};
