import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const transitionDuration = '0.2s';

export const input = {
  height: 40,
};

export const thumb = {
  size: 16,
  borderWidth: 2,
  background: token('elevation.surface.raised', colors.N0),
  borderColor: {
    default: 'transparent',
    focused: token('color.border.focused', colors.B200),
  },
  boxShadow: {
    default: token(
      'elevation.shadow.overlay',
      `0 4px 8px -2px ${colors.N50A}, 0 0 1px ${colors.N60A}`,
    ),
    disabled: token('elevation.shadow.raised', `0 0 1px ${colors.N60A}`),
  },
};

export const track = {
  height: 4,
  /**
   * borderRadius >= height / 2 to create a pill shape.
   * Using '50%' creates an ellipse.
   */
  borderRadius: 2,
  background: {
    default: token('color.background.neutral', colors.N30),
    hovered: token('color.background.neutral.hovered', colors.N40),
    disabled: token('color.background.disabled', colors.N30),
  },
  foreground: {
    default: token('color.background.brand.bold', colors.B400),
    hovered: token('color.background.brand.bold.hovered', colors.B300),
    disabled: token('color.text.disabled', colors.N50),
  },
};
