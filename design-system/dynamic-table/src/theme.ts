import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';

export const MSThemeColors = {
  Background: 'Canvas',
  Text: 'CanvasText',
  SelectedBackground: 'Highlight',
  SelectedText: 'HighlightText',
};

export const arrow = {
  defaultColor: themed({ light: colors.N40, dark: colors.DN40 }),
  selectedColor: themed({ light: colors.N300, dark: colors.DN300 }),
  hoverColor: themed({ light: colors.N60, dark: colors.DN60 }),
};

export const row = {
  focusOutline: themed({ light: colors.B100, dark: colors.B100 }),
  highlightedBackground: themed({ light: colors.B50, dark: colors.DN50 }),
  hoverBackground: themed({ light: colors.N10, dark: colors.DN40 }),
  hoverHighlightedBackground: themed({ light: colors.B75, dark: colors.DN60 }),
};

export const head = {
  borderColor: themed({ light: colors.N40, dark: colors.DN50 }),
  textColor: themed({ light: colors.N300, dark: colors.DN300 }),
};
