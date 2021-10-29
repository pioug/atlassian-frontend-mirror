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
    light: token('color.background.subtleNeutral.resting', colors.N40),
    dark: token('color.background.subtleNeutral.resting', colors.DN40),
  }),
  selectedColor: themed({
    light: token('color.text.lowEmphasis', colors.N300),
    dark: token('color.text.lowEmphasis', colors.DN300),
  }),
  hoverColor: themed({
    light: token('color.background.subtleNeutral.pressed', colors.N60),
    dark: token('color.background.subtleNeutral.pressed', colors.DN60),
  }),
};

export const row = {
  focusOutline: themed({
    light: token('color.border.focus', colors.B100),
    dark: token('color.border.focus', colors.B100),
  }),
  highlightedBackground: themed({
    light: token('color.background.selected.resting', colors.B50),
    dark: token('color.background.selected.resting', colors.DN50),
  }),
  hoverBackground: themed({
    light: token('color.background.subtleBorderedNeutral.resting', colors.N10),
    dark: token('color.background.subtleBorderedNeutral.resting', colors.DN40),
  }),
  hoverHighlightedBackground: themed({
    light: token('color.background.selected.hover', colors.B75),
    dark: token('color.background.selected.hover', colors.DN60),
  }),
};

export const head = {
  borderColor: themed({
    light: token('color.border.neutral', colors.N40),
    dark: token('color.border.neutral', colors.DN50),
  }),
  textColor: themed({
    light: token('color.text.lowEmphasis', colors.N300),
    dark: token('color.text.lowEmphasis', colors.DN300),
  }),
};
