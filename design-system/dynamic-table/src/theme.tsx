import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const MSThemeColors = {
  Background: 'Canvas',
  Text: 'CanvasText',
  SelectedBackground: 'Highlight',
  SelectedText: 'HighlightText',
};

export const arrow = {
  defaultColor: token('color.icon.disabled', colors.N40),
  selectedColor: token('color.icon.subtle', colors.N300),
};

export const row = {
  focusOutline: token('color.border.focused', colors.B100),
  highlightedBackground: token('color.background.selected', colors.B50),
  hoverBackground: token('color.background.neutral.subtle.hovered', colors.N10),
  hoverHighlightedBackground: token(
    'color.background.selected.hovered',
    colors.B75,
  ),
};

export const head = {
  textColor: token('color.text.subtlest', colors.N300),
};

export const tableBorder = {
  borderColor: token('color.border', colors.N40),
};
