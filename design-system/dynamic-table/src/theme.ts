import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

export const MSThemeColors = {
  Background: 'Canvas',
  Text: 'CanvasText',
  SelectedBackground: 'Highlight',
  SelectedText: 'HighlightText',
};

export const arrow = {
  defaultColor: themed({
    light: token('color.background.neutral', colors.N40),
    dark: token('color.background.neutral', colors.DN40),
  }),
  selectedColor: themed({
    light: token('color.text.subtlest', colors.N300),
    dark: token('color.text.subtlest', colors.DN300),
  }),
  hoverColor: themed({
    light: token('color.background.neutral.pressed', colors.N60),
    dark: token('color.background.neutral.pressed', colors.DN60),
  }),
};

export const row = {
  focusOutline: themed({
    light: token('color.border.focused', colors.B100),
    dark: token('color.border.focused', colors.B100),
  }),
  highlightedBackground: themed({
    light: token('color.background.brand', colors.B50),
    dark: token('color.background.brand', colors.DN50),
  }),
  hoverBackground: themed({
    light: token('color.background.input', colors.N10),
    dark: token('color.background.input', colors.DN40),
  }),
  hoverHighlightedBackground: themed({
    light: token('color.background.brand.hovered', colors.B75),
    dark: token('color.background.brand.hovered', colors.DN60),
  }),
};

export const head = {
  borderColor: themed({
    light: token('color.border', colors.N40),
    dark: token('color.border', colors.DN50),
  }),
  textColor: themed({
    light: token('color.text.subtlest', colors.N300),
    dark: token('color.text.subtlest', colors.DN300),
  }),
};
