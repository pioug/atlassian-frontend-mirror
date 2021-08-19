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
import { token } from '@atlaskit/tokens';

export type TabColors = {
  labelColor: string;
  activeLabelColor: string;
  hoverLabelColor: string;
  selectedColor: string;
  focusBorderColor: string;
};

const tabColorMap = {
  light: {
    labelColor: token('color.text.mediumEmphasis', N500),
    activeLabelColor: token('color.text.highEmphasis', B500),
    hoverLabelColor: token('color.text.mediumEmphasis', B400),
    selectedColor: token('color.text.selected', B400),
    focusBorderColor: token('color.border.focus', B100),
  },
  dark: {
    labelColor: token('color.text.mediumEmphasis', DN400),
    activeLabelColor: token('color.text.highEmphasis', B200),
    hoverLabelColor: token('color.text.mediumEmphasis', B75),
    selectedColor: token('color.text.selected', B75),
    focusBorderColor: token('color.border.focus', B75),
  },
};

export const getTabColors = (mode: ThemeModes): TabColors => {
  return tabColorMap[mode];
};

export type TabLineColors = {
  lineColor: string;
  hoveredColor: string;
  activeColor: string;
  selectedColor: string;
};

const tabLineColorMap = {
  light: {
    lineColor: token('color.border.neutral', N30),
    hoveredColor: token('color.border.neutral', 'transparent'),
    activeColor: token('color.border.neutral', 'transparent'),
    selectedColor: token('color.text.selected', B400),
  },
  dark: {
    lineColor: token('color.border.neutral', DN0),
    hoveredColor: token('color.border.neutral', 'transparent'),
    activeColor: token('color.border.neutral', 'transparent'),
    selectedColor: token('color.text.selected', B75),
  },
};

export const getTabLineColor = (mode: ThemeModes): TabLineColors =>
  tabLineColorMap[mode];

const tabPanelFocusColorMap = {
  light: token('color.border.focus', B100),
  dark: token('color.border.focus', B75),
};

export const getTabPanelFocusColor = (mode: ThemeModes): string =>
  tabPanelFocusColorMap[mode];
