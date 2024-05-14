import {
  B200,
  N0,
  N10,
  N100,
  N20,
  N200,
  N30,
  N40,
  N70,
  N900,
  R400,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const disabledBackground = token('color.background.disabled', N20);
export const disabledBorder = token('color.border.disabled', N40);
export const invalidBorderColor = token('color.border.danger', R400);

export const defaultBorderColor = token('color.border.input', N100);

export const defaultBorderColorFocus = token('color.border.focused', B200);
export const defaultBackgroundColor = token('color.background.input', N10);

export const defaultBackgroundColorHover = token(
  'color.background.input.hovered',
  N30,
);

export const defaultBackgroundColorFocus = token(
  'color.background.input.pressed',
  N0,
);

export const subtleBorderColorHover = token(
  'color.border.input',
  'transparent',
);

export const placeholderTextColor = token('color.text.subtlest', N200);
export const textColor = token('color.text', N900);
export const disabledTextColor = token('color.text.disabled', N70);
export const transparent = 'transparent';
