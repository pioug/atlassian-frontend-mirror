import {
  B100,
  B400,
  B500,
  DN0,
  DN400,
  DN70,
  DN900,
  G50,
  G500,
  N0,
  N40,
  N800,
  R400,
  R50,
  R500,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const backgroundColors = {
  added: {
    light: token('color.background.subtleSuccess.resting', G50),
    dark: token('color.background.subtleSuccess.resting', G50),
  },
  default: {
    light: token('color.background.subtleNeutral.resting', N40),
    dark: token('color.background.subtleNeutral.resting', DN70),
  },
  important: {
    light: token('color.background.boldDanger.resting', R400),
    dark: token('color.background.boldDanger.resting', R400),
  },
  primary: {
    light: token('color.background.boldBrand.resting', B400),
    dark: token('color.background.boldBrand.resting', B100),
  },
  primaryInverted: {
    light: token('color.background.default', N0),
    dark: token('color.background.default', DN400),
  },
  removed: {
    light: token('color.background.subtleDanger.resting', R50),
    dark: token('color.background.subtleDanger.resting', R50),
  },
};

export const textColors = {
  added: {
    light: token('color.text.success', G500),
    dark: token('color.text.success', G500),
  },
  default: {
    light: token('color.text.highEmphasis', N800),
    dark: token('color.text.highEmphasis', DN900),
  },
  important: {
    light: token('color.text.onBold', N0),
    dark: token('color.text.onBold', N0),
  },
  primary: {
    light: token('color.text.onBold', N0),
    dark: token('color.text.onBold', DN0),
  },
  primaryInverted: {
    light: token('color.text.brand', B500),
    dark: token('color.text.brand', DN0),
  },
  removed: {
    light: token('color.text.danger', R500),
    dark: token('color.text.danger', R500),
  },
};
