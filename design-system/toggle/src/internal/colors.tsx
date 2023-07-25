import {
  B100,
  B200,
  DN0,
  DN30,
  DN400,
  DN600,
  DN70,
  G200,
  G300,
  G400,
  G500,
  N0,
  N20,
  N200,
  N400,
  N70,
} from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

export type ToggleContainerColors = {
  backgroundColorChecked: string;
  backgroundColorCheckedHover: string;
  backgroundColorCheckedDisabled: string;

  backgroundColorUnchecked: string;
  backgroundColorUncheckedHover: string;
  backgroundColorUncheckedDisabled: string;

  borderColorFocus: string;

  iconColorChecked: string;
  iconColorUnchecked: string;
  iconColorDisabled: string;

  handleBackgroundColor: string;
  handleBackgroundColorChecked: string;
  handleBackgroundColorDisabled: string;
};

const colorMap = {
  light: {
    backgroundColorChecked: token('color.background.success.bold', G400),
    backgroundColorCheckedHover: token(
      'color.background.success.bold.hovered',
      G500,
    ),
    backgroundColorCheckedDisabled: token('color.background.disabled', N20),

    backgroundColorUnchecked: token('color.background.neutral.bold', N200),
    backgroundColorUncheckedHover: token(
      'color.background.neutral.bold.hovered',
      N400,
    ),
    backgroundColorUncheckedDisabled: token('color.background.disabled', N20),

    borderColorFocus: token('color.border.focused', B200),

    iconColorChecked: token('color.icon.inverse', N0),
    iconColorDisabled: token('color.icon.disabled', N70),
    iconColorUnchecked: token('color.icon.inverse', N0),

    handleBackgroundColor: token('color.icon.inverse', N0),
    handleBackgroundColorChecked: token('color.icon.inverse', N0),
    handleBackgroundColorDisabled: token('color.icon.inverse', N0),
  },
  dark: {
    backgroundColorChecked: token('color.background.success.bold', G300),
    backgroundColorCheckedHover: token(
      'color.background.success.bold.hovered',
      G200,
    ),
    backgroundColorCheckedDisabled: token('color.background.disabled', DN70),

    backgroundColorUnchecked: token('color.background.neutral.bold', DN70),
    backgroundColorUncheckedHover: token(
      'color.background.neutral.bold.hovered',
      DN400,
    ),
    backgroundColorUncheckedDisabled: token('color.background.disabled', DN70),

    borderColorFocus: token('color.border.focused', B100),

    iconColorChecked: token('color.icon.inverse', DN30),
    iconColorDisabled: token('color.icon.disabled', DN30),
    iconColorUnchecked: token('color.icon.inverse', DN600),

    handleBackgroundColor: token('color.icon.inverse', DN600),
    handleBackgroundColorChecked: token('color.icon.inverse', DN0),
    handleBackgroundColorDisabled: token('color.icon.inverse', DN0),
  },
};

export const getColors = (mode: ThemeModes): ToggleContainerColors => {
  return colorMap[mode];
};
