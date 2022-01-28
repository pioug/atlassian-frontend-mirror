import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

export const bgColor = themed({
  light: token('elevation.surface.overlay', colors.N0),
  dark: token('elevation.surface.overlay', colors.DN50),
});

export const headerBgColor = themed({
  light: token('color.background.brand.bold', colors.B500),
  dark: token('color.background.brand.bold', colors.B100),
});

export const teamHeaderBgColor = themed({
  light: token('color.background.neutral', colors.N50),
  dark: token('color.background.neutral', colors.N50),
});

export const headerBgColorDisabledUser = themed({
  light: token('color.background.disabled', colors.N30),
  dark: token('color.background.disabled', colors.B100),
});

export const headerTextColor = themed({
  light: token('color.text.inverse', colors.N0),
  dark: token('color.text.inverse', colors.N0),
});

export const headerTextColorInactive = themed({
  light: token('color.text', colors.N800),
  dark: token('color.text', colors.N0),
});

export const appLabelBgColor = themed({
  light: token('color.background.neutral', colors.N20),
  dark: token('color.background.neutral', colors.N20),
});

export const appLabelTextColor = themed({
  light: token('color.text', colors.N500),
  dark: token('color.text', colors.N500),
});

export const labelTextColor = themed({
  light: token('color.text', colors.N800),
  dark: token('color.text', colors.DN900),
});

export const labelIconColor = themed({
  light: token('color.text.subtlest', colors.N60),
  dark: token('color.text.subtlest', colors.DN100),
});

export const errorIconColor = themed({
  light: token('color.text.disabled', colors.N90),
  dark: token('color.text.disabled', colors.DN90),
});

export const errorTitleColor = themed({
  light: token('color.text', colors.N800),
  dark: token('color.text', colors.DN800),
});

export const errorTextColor = themed({
  light: token('color.text.subtlest', colors.N90),
  dark: token('color.text.subtlest', colors.DN90),
});

export const boxShadow = themed({
  light: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${colors.N50A}, 0 0 1px ${colors.N60A}`,
  ),
  dark: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${colors.DN50A}, 0 0 1px ${colors.DN60A}`,
  ),
});
