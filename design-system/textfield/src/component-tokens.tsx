import {
  B100,
  B75,
  DN10,
  DN30,
  DN40,
  DN600,
  DN90,
  N0,
  N10,
  N100,
  N30,
  N40,
  N70,
  N900,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const disabledBackgroundColor = {
  light: token('color.background.disabled', N10),
  dark: token('color.background.disabled', DN10),
};

export const defaultBackgroundColor = {
  light: token('color.background.subtleBorderedNeutral.resting', N10),
  dark: token('color.background.subtleBorderedNeutral.resting', DN10),
};

export const defaultBackgroundColorFocus = {
  light: token('color.background.default', N0),
  dark: token('color.background.default', DN10),
};

export const defaultBackgroundColorHover = {
  light: token('color.background.default', N30),
  dark: token('color.background.default', DN30),
};

export const subtleBackgroundColorHover = {
  light: token('color.background.transparentNeutral.hover', N30),
  dark: token('color.background.transparentNeutral.hover', DN30),
};

export const defaultBorderColor = {
  light: token('color.border.neutral', N40),
  dark: token('color.border.neutral', DN40),
};

export const defaultBorderColorFocus = {
  light: token('color.border.focus', B100),
  dark: token('color.border.focus', B75),
};

export const transparent = { light: 'transparent', dark: 'transparent' };

export const textColor = {
  light: token('color.text.highEmphasis', N900),
  dark: token('color.text.highEmphasis', DN600),
};

export const disabledTextColor = {
  light: token('color.text.disabled', N70),
  dark: token('color.text.disabled', DN90),
};

export const placeholderTextColor = {
  light: token('color.text.lowEmphasis', N100),
  dark: token('color.text.lowEmphasis', DN90),
};
