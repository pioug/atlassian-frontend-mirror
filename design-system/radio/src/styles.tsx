import { getBooleanFF } from '@atlaskit/platform-feature-flags';
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
  N100,
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
    backgroundHover: token('color.background.input.hovered', N30),
    backgroundActive: token('color.background.input.pressed', N30),
    backgroundChecked: token('color.background.brand.bold', B400),
    backgroundCheckedHover: token('color.background.brand.bold.hovered', B300),
    backgroundCheckedActive: token('color.background.brand.bold.pressed', B50),
    backgroundDisabled: token('color.background.disabled', N20),

    dotChecked: token('color.icon.inverse', N10),
    dotDisabled: token('color.icon.disabled', N70),
    dotActive: token('color.icon.inverse', B400),

    border: token(
      'color.border.input',
      getBooleanFF('platform.design-system-team.update-border-input_ff9l1')
        ? N100
        : N40,
    ),
    borderHover: token(
      'color.border.input',
      getBooleanFF('platform.design-system-team.update-border-input_ff9l1')
        ? N100
        : N40,
    ),
    borderDisabled: token('color.border.disabled', N20),
    borderFocus: token('color.border.focused', B100),
  },
  dark: {
    background: token('color.background.input', DN10),
    backgroundHover: token('color.background.input.hovered', DN30),
    backgroundActive: token('color.background.input.pressed', B200),
    backgroundChecked: token('color.background.brand.bold', B400),
    backgroundCheckedHover: token('color.background.brand.bold.hovered', B75),
    backgroundCheckedActive: token('color.background.brand.bold.pressed', B200),
    backgroundDisabled: token('color.background.disabled', DN10),

    dotChecked: token('color.icon.inverse', DN10),
    dotDisabled: token('color.icon.disabled', DN90),
    dotActive: token('color.icon.inverse', DN10),

    border: token(
      'color.border.input',
      getBooleanFF('platform.design-system-team.update-border-input_ff9l1')
        ? DN200
        : DN80,
    ),
    borderHover: token('color.border.input', DN200),
    borderDisabled: token('color.border.disabled', DN10),
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
