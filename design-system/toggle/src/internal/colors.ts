import {
  B100,
  B75,
  DN0,
  DN30,
  DN60,
  DN600,
  DN70,
  G200,
  G300,
  G400,
  N0,
  N20,
  N200,
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
    backgroundColorChecked: token('color.background.boldSuccess.resting', G400),
    backgroundColorCheckedHover: token(
      'color.background.boldSuccess.hover',
      G300,
    ),
    backgroundColorCheckedDisabled: token('color.background.disabled', N20),

    backgroundColorUnchecked: token(
      'color.background.boldNeutral.resting',
      N200,
    ),
    backgroundColorUncheckedHover: token(
      'color.background.boldNeutral.hover',
      N70,
    ),
    backgroundColorUncheckedDisabled: token('color.background.disabled', N20),

    borderColorFocus: token('color.border.focus', B100),

    iconColorChecked: token('color.text.onBold', N0),
    iconColorDisabled: token('color.text.disabled', N70),
    iconColorUnchecked: token('color.text.onBold', N0),

    handleBackgroundColor: token('color.background.default', N0),
    handleBackgroundColorChecked: token('color.background.default', N0),
    handleBackgroundColorDisabled: token('color.text.disabled', N0),
  },
  dark: {
    backgroundColorChecked: token('color.background.boldSuccess.resting', G300),
    backgroundColorCheckedHover: token(
      'color.background.boldSuccess.hover',
      G200,
    ),
    backgroundColorCheckedDisabled: token('color.background.disabled', DN70),

    backgroundColorUnchecked: token(
      'color.background.boldNeutral.resting',
      DN70,
    ),
    backgroundColorUncheckedHover: token(
      'color.background.boldNeutral.hover',
      DN60,
    ),
    backgroundColorUncheckedDisabled: token('color.background.disabled', DN70),

    borderColorFocus: token('color.border.focus', B75),

    iconColorChecked: token('color.text.onBold', DN30),
    iconColorDisabled: token('color.text.disabled', DN30),
    iconColorUnchecked: token('color.text.onBold', DN600),

    handleBackgroundColor: token('color.background.default', DN600),
    handleBackgroundColorChecked: token('color.background.default', DN0),
    handleBackgroundColorDisabled: token('color.text.disabled', DN0),
  },
};

export const getColors = (mode: ThemeModes): ToggleContainerColors => {
  return colorMap[mode];
};
