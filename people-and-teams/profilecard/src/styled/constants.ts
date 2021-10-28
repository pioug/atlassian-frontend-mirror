import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

export const bgColor = themed({
  light: token('color.background.overlay', colors.N0),
  dark: token('color.background.overlay', colors.DN50),
});

export const headerBgColor = themed({
  light: token('color.background.boldBrand.resting', colors.B500),
  dark: token('color.background.boldBrand.resting', colors.B100),
});

export const teamHeaderBgColor = themed({
  light: token('color.background.subtleNeutral.resting', colors.N50),
  dark: token('color.background.subtleNeutral.resting', colors.N50),
});

export const headerBgColorDisabledUser = themed({
  light: token('color.background.disabled', colors.N30),
  dark: token('color.background.disabled', colors.B100),
});

export const headerTextColor = themed({
  light: token('color.text.onBold', colors.N0),
  dark: token('color.text.onBold', colors.N0),
});

export const headerTextColorInactive = themed({
  light: token('color.text.highEmphasis', colors.N800),
  dark: token('color.text.highEmphasis', colors.N0),
});

export const appLabelBgColor = themed({
  light: token('color.background.subtleNeutral.resting', colors.N20),
  dark: token('color.background.subtleNeutral.resting', colors.N20),
});

export const appLabelTextColor = themed({
  light: token('color.text.highEmphasis', colors.N500),
  dark: token('color.text.highEmphasis', colors.N500),
});

export const labelTextColor = themed({
  light: token('color.text.highEmphasis', colors.N800),
  dark: token('color.text.highEmphasis', colors.DN900),
});

export const labelIconColor = themed({
  light: token('color.text.lowEmphasis', colors.N60),
  dark: token('color.text.lowEmphasis', colors.DN100),
});

export const errorIconColor = themed({
  light: token('color.text.disabled', colors.N90),
  dark: token('color.text.disabled', colors.DN90),
});

export const errorTitleColor = themed({
  light: token('color.text.highEmphasis', colors.N800),
  dark: token('color.text.highEmphasis', colors.DN800),
});

export const errorTextColor = themed({
  light: token('color.text.lowEmphasis', colors.N90),
  dark: token('color.text.lowEmphasis', colors.DN90),
});

export const boxShadow = themed({
  light: token(
    'shadow.overlay',
    `0 4px 8px -2px ${colors.N50A}, 0 0 1px ${colors.N60A}`,
  ),
  dark: token(
    'shadow.overlay',
    `0 4px 8px -2px ${colors.DN50A}, 0 0 1px ${colors.DN60A}`,
  ),
});
