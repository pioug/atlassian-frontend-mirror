import { B200, B100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const avatarImageStyles = `
  border-radius: ${token('border.radius.100', '3px')};
  cursor: pointer;
`;

export const visuallyHiddenRadioStyles = `
  width: 1px;
  height: 1px;
  padding: 0;
  position: fixed;
  border: 0;
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  white-space: nowrap;
`;

export const selectedShadow = `box-shadow: 0px 0px 0px 1px ${token(
  'color.border.inverse',
  'white',
)}, 0px 0px 0px 3px ${token('color.border.selected', B200)};`;

export const focusedShadow = `box-shadow: 0px 0px 0px 1px ${token(
  'color.border.inverse',
  'white',
)}, 0px 0px 0px 3px ${token('color.border.focused', B100)};`;
