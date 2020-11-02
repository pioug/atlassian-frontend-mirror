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
    backgroundColorChecked: G400,
    backgroundColorCheckedHover: G300,
    backgroundColorCheckedDisabled: N20,

    backgroundColorUnchecked: N200,
    backgroundColorUncheckedHover: N70,
    backgroundColorUncheckedDisabled: N20,

    borderColorFocus: B100,

    iconColorChecked: N0,
    iconColorDisabled: N70,
    iconColorUnchecked: N0,

    handleBackgroundColor: N0,
    handleBackgroundColorChecked: N0,
    handleBackgroundColorDisabled: N0,
  },
  dark: {
    backgroundColorChecked: G300,
    backgroundColorCheckedHover: G200,
    backgroundColorCheckedDisabled: DN70,

    backgroundColorUnchecked: DN70,
    backgroundColorUncheckedHover: DN60,
    backgroundColorUncheckedDisabled: DN70,

    borderColorFocus: B75,

    iconColorChecked: DN30,
    iconColorDisabled: DN30,
    iconColorUnchecked: DN600,

    handleBackgroundColor: DN600,
    handleBackgroundColorChecked: DN0,
    handleBackgroundColorDisabled: DN0,
  },
};

export const getColors = (mode: ThemeModes): ToggleContainerColors => {
  return colorMap[mode];
};
