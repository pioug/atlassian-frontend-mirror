import { CSSObject } from '@emotion/core';

import {
  borderRadius as getBorderRadius,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import { getTabColors, getTabLineColor, getTabPanelFocusColor } from './colors';

const borderRadius = getBorderRadius();
const gridSize = getGridSize();

const tabLeftRightPadding = `${gridSize}px`;
const tabTopBottomPadding = `${gridSize / 2}px`;
const underlineHeight = '2px';

// Required so the focus ring is visible in high contrast mode
const highContrastFocusRing = {
  '@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
    '&:focus': {
      outline: '1px solid',
    },
  },
};

const getTabPanelStyles = (mode: ThemeModes): CSSObject => ({
  flexGrow: 1,
  /*
    NOTE min-height set to 0% because of Firefox bug
    FF http://stackoverflow.com/questions/28636832/firefox-overflow-y-not-working-with-nested-flexbox
  */
  minHeight: '0%',
  display: 'flex',
  padding: `0 ${tabLeftRightPadding}`,
  '&:focus': {
    boxShadow: `0 0 0 2px ${getTabPanelFocusColor(mode)} inset`,
    borderRadius: borderRadius,
    outline: 'none',
  },
  ...highContrastFocusRing,
});

export const getTabsStyles = (mode: ThemeModes): CSSObject => ({
  display: 'flex',
  flexBasis: '100%',
  flexDirection: 'column',
  flexGrow: 1,
  maxWidth: '100%',
  minHeight: '0%' /* Same Firefox bug as above */,

  '& [role="tabpanel"]': getTabPanelStyles(mode),
  // The hidden attribute doesn't work on flex elements
  // Change display to be none
  '& > [hidden]': {
    display: 'none',
  },
});

const tabLineStyles: CSSObject = {
  content: '""',
  borderRadius: underlineHeight,
  bottom: 0,
  margin: 0,
  position: 'absolute',
  width: 'inherit',
  left: tabLeftRightPadding,
  right: tabLeftRightPadding,
};

export const getTabListStyles = (mode: ThemeModes): CSSObject => ({
  position: 'relative',
  display: 'flex',
  fontWeight: 500,
  padding: 0,
  margin: 0,
  '&::before': {
    ...tabLineStyles,
    // This line is not a border so the selected line is visible in high contrast mode
    backgroundColor: getTabLineColor(mode).lineColor,
    height: underlineHeight,
  },
  '& [role="tab"]': getTabStyles(mode),
});

export const getTabStyles = (mode: ThemeModes): CSSObject => {
  const colors = getTabColors(mode);
  return {
    color: colors.labelColor,
    cursor: 'pointer',
    lineHeight: 1.8,
    margin: 0,
    padding: `${tabTopBottomPadding} ${tabLeftRightPadding}`,
    position: 'relative',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',

    '&:hover': {
      // TODO: interaction states will be reviewed in DSP-1438
      color: colors.hoverLabelColor,
      '&::after': {
        ...tabLineStyles,
        borderBottom: `${underlineHeight} solid ${
          getTabLineColor(mode).hoveredColor
        }`,
        height: 0,
      },
    },

    '&:active': {
      // TODO: interaction states will be reviewed in DSP-1438
      color: colors.activeLabelColor,
      '&::after': {
        ...tabLineStyles,
        borderBottom: `${underlineHeight} solid ${
          getTabLineColor(mode).activeColor
        }`,
        height: 0,
      },
    },

    '&:focus': {
      boxShadow: `0 0 0 2px ${colors.focusBorderColor} inset`,
      borderRadius: borderRadius,
      outline: 'none',
      // Hide TabLine on focus
      '&::after': {
        opacity: 0,
      },
    },
    ...highContrastFocusRing,

    '&[aria-selected="true"]': {
      color: colors.selectedColor,
      '&::after': {
        ...tabLineStyles,
        // This line is a border so it is visible in high contrast mode
        borderBottom: `${underlineHeight} solid ${
          getTabLineColor(mode).selectedColor
        }`,
        height: 0,
      },
    },
  };
};
