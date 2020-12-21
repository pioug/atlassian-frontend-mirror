import {
  B200,
  B400,
  B500,
  B75,
  DN0,
  DN400,
  N30,
  N500,
} from '@atlaskit/theme/colors';
import { ThemeModes } from '@atlaskit/theme/types';

export type NavItemColors = {
  labelColor: string;
  activeLabelColor: string;
  hoverLabelColor: string;
  selectedColor: string;
};

const navItemColorMap = {
  light: {
    labelColor: N500,
    activeLabelColor: B500,
    hoverLabelColor: B400,
    selectedColor: B400,
  },
  dark: {
    labelColor: DN400,
    activeLabelColor: B200,
    hoverLabelColor: B75,
    selectedColor: B75,
  },
};

export const getNavItemColors = (mode: ThemeModes): NavItemColors => {
  return navItemColorMap[mode];
};

export type NavLineColors = {
  lineColor: string;
  selectedColor: string;
};

const navLineColorMap = {
  light: {
    lineColor: N30,
    selectedColor: B400,
  },
  dark: {
    lineColor: DN0,
    selectedColor: B75,
  },
};

export const getNavLineColor = (mode: ThemeModes): NavLineColors =>
  navLineColorMap[mode];
