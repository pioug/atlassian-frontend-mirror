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
    light: token('color.background.success', G50),
    dark: token('color.background.success', G50),
  },
  default: {
    light: token('color.background.neutral', N40),
    dark: token('color.background.neutral', DN70),
  },
  important: {
    light: token('color.background.danger.bold', R400),
    dark: token('color.background.danger.bold', R400),
  },
  primary: {
    light: token('color.background.brand.bold', B400),
    dark: token('color.background.brand.bold', B100),
  },
  primaryInverted: {
    light: token('elevation.surface', N0),
    dark: token('elevation.surface', DN400),
  },
  removed: {
    light: token('color.background.danger', R50),
    dark: token('color.background.danger', R50),
  },
};

export const textColors = {
  added: {
    light: token('color.text.success', G500),
    dark: token('color.text.success', G500),
  },
  default: {
    light: token('color.text', N800),
    dark: token('color.text', DN900),
  },
  important: {
    light: token('color.text.inverse', N0),
    dark: token('color.text.inverse', N0),
  },
  primary: {
    light: token('color.text.inverse', N0),
    dark: token('color.text.inverse', DN0),
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
