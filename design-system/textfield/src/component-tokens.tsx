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
  light: token('color.background.input', N10),
  dark: token('color.background.input', DN10),
};

export const defaultBackgroundColorFocus = {
  light: token('color.background.input.pressed', N0),
  dark: token('color.background.input.pressed', DN10),
};

export const defaultBackgroundColorHover = {
  light: token('color.background.input.hovered', N30),
  dark: token('color.background.input.hovered', DN30),
};

export const subtleBackgroundColorHover = {
  light: token('color.background.neutral.subtle.hovered', N30),
  dark: token('color.background.neutral.subtle.hovered', DN30),
};

export const defaultBorderColor = {
  light: token('color.border', N40),
  dark: token('color.border', DN40),
};

export const defaultBorderColorFocus = {
  light: token('color.border.focused', B100),
  dark: token('color.border.focused', B75),
};

export const transparent = { light: 'transparent', dark: 'transparent' };

export const textColor = {
  light: token('color.text', N900),
  dark: token('color.text', DN600),
};

export const disabledTextColor = {
  light: token('color.text.disabled', N70),
  dark: token('color.text.disabled', DN90),
};

export const placeholderTextColor = {
  light: token('color.text.subtlest', N100),
  dark: token('color.text.subtlest', DN90),
};
