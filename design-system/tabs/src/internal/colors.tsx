import { B100, B400, B500, N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const tabColors = {
  labelColor: token('color.text.subtle', N500),
  activeLabelColor: token('color.text', B500),
  hoverLabelColor: token('color.text.subtle', B400),
  selectedColor: token('color.text.selected', B400),
  focusBorderColor: token('color.border.focused', B100),
};

export const tabLineColors = {
  lineColor: token('color.border', N30),
  hoveredColor: token('color.border', 'transparent'),
  activeColor: token('color.border', 'transparent'),
  selectedColor: token('color.border.selected', B400),
};
