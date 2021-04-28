import {
  B100,
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

export type TabColors = {
  labelColor: string;
  activeLabelColor: string;
  hoverLabelColor: string;
  selectedColor: string;
  focusColor: string;
};

const tabColorMap = {
  light: {
    labelColor: N500,
    activeLabelColor: B500,
    hoverLabelColor: B400,
    selectedColor: B400,
    focusColor: B100,
  },
  dark: {
    labelColor: DN400,
    activeLabelColor: B200,
    hoverLabelColor: B75,
    selectedColor: B75,
    focusColor: B75,
  },
};

export const getTabColors = (mode: ThemeModes): TabColors => {
  return tabColorMap[mode];
};

export type TabLineColors = {
  lineColor: string;
  selectedColor: string;
};

const tabLineColorMap = {
  light: {
    lineColor: N30,
    selectedColor: B400,
  },
  dark: {
    lineColor: DN0,
    selectedColor: B75,
  },
};

export const getTabLineColor = (mode: ThemeModes): TabLineColors =>
  tabLineColorMap[mode];

const tabPanelFocusColorMap = {
  light: B100,
  dark: B75,
};

export const getTabPanelFocusColor = (mode: ThemeModes): string =>
  tabPanelFocusColorMap[mode];
