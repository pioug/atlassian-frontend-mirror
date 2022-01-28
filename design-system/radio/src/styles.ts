import {
  B100,
  B200,
  B300,
  B400,
  B50,
  B75,
  DN10,
  DN200,
  DN30,
  DN80,
  DN90,
  N10,
  N20,
  N30,
  N40,
  N70,
  R300,
} from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

const radioThemeColors = {
  light: {
    background: token('color.background.input', N10),
    backgroundHover: token('elevation.surface', N30),
    backgroundActive: token('color.background.input.pressed', N30),
    backgroundChecked: token('color.background.brand.bold', B400),
    backgroundCheckedHover: token('color.background.brand.bold.hovered', B300),
    backgroundCheckedActive: token('color.background.brand.bold.pressed', B50),
    backgroundDisabled: token('color.background.input', N20),

    dotChecked: token('color.text.inverse', N10),
    dotDisabled: token('color.text.disabled', N70),
    dotActive: token('color.text.inverse', B400),

    border: token('color.border', N40),
    borderHover: token('color.border', N40),
    borderDisabled: token('color.background.disabled', N20),
    borderFocus: token('color.border.focused', B100),
  },
  dark: {
    background: token('color.background.input', DN10),
    backgroundHover: token('elevation.surface', DN30),
    backgroundActive: token('color.background.input.pressed', B200),
    backgroundChecked: token('color.background.brand.bold', B400),
    backgroundCheckedHover: token('color.background.brand.bold.hovered', B75),
    backgroundCheckedActive: token('color.background.brand.bold.pressed', B200),
    backgroundDisabled: token('color.background.input', DN10),

    dotChecked: token('color.text.inverse', DN10),
    dotDisabled: token('color.text.disabled', DN90),
    dotActive: token('color.text.inverse', DN10),

    border: token('color.border', DN80),
    borderHover: token('color.border', DN200),
    borderDisabled: token('color.background.disabled', DN10),
    borderFocus: token('color.border.focused', B75),
  },
};

export default function getRadioCustomProperties(mode: ThemeModes) {
  const radioColors = radioThemeColors[mode];
  return {
    '--local-background': radioColors.background,
    '--local-background-active': radioColors.backgroundActive,
    '--local-background-checked': radioColors.backgroundChecked,
    '--local-background-checked-active': radioColors.backgroundCheckedActive,
    '--local-background-checked-hover': radioColors.backgroundCheckedHover,
    '--local-background-disabled': radioColors.backgroundDisabled,
    '--local-background-hover': radioColors.backgroundHover,

    '--local-border': radioColors.border,
    '--local-border-disabled': radioColors.borderDisabled,
    '--local-border-hover': radioColors.borderHover,
    '--local-border-focus': radioColors.borderFocus,

    '--local-dot-active': radioColors.dotActive,
    '--local-dot-checked': radioColors.dotChecked,
    '--local-dot-disabled': radioColors.dotDisabled,

    '--local-invalid': token('color.icon.danger', R300),
  };
}
