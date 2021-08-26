import { Breakpoint } from './Breakpoint';

export const responsiveSettings = {
  [Breakpoint.SMALL]: {
    fontSize: 11,
    lineHeight: 14,
    titleBox: {
      verticalPadding: 4,
      horizontalPadding: 8,
    },
  },
  [Breakpoint.LARGE]: {
    fontSize: 14,
    lineHeight: 22,
    titleBox: {
      verticalPadding: 8,
      horizontalPadding: 12,
    },
  },
};

export const getTitleBoxHeight = (breakpoint: Breakpoint) =>
  (responsiveSettings[breakpoint].lineHeight +
    responsiveSettings[breakpoint].titleBox.verticalPadding) *
  2;
