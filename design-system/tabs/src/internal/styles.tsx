import { css, CSSObject, SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { tabColors, tabLineColors } from './colors';

const tabLeftRightPadding = token('space.100', '8px');
const tabTopBottomPadding = token('space.050', '4px');
// TODO this should probably be `border.width.indicator`
const underlineHeight = token('border.width.outline', '2px');

const getTabPanelStyles = (): CSSObject => ({
  flexGrow: 1,
  /*
    NOTE min-height set to 0% because of Firefox bug
    FF http://stackoverflow.com/questions/28636832/firefox-overflow-y-not-working-with-nested-flexbox
  */
  minHeight: '0%',
  display: 'flex',
  padding: `0 ${tabLeftRightPadding}`,
});

export const getTabsStyles = (): SerializedStyles =>
  // eslint-disable-next-line @repo/internal/styles/no-exported-styles
  css({
    '& [role="tabpanel"]': getTabPanelStyles(),
    // The hidden attribute doesn't work on flex elements
    // Change display to be none
    // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
    '& > [hidden]': {
      display: 'none',
    },
  });

const tabLineStyles: CSSObject = {
  content: '""',
  borderRadius: token('border.radius.050', '2px'),
  bottom: 0,
  margin: 0,
  position: 'absolute',
  width: 'inherit',
  left: tabLeftRightPadding,
  right: tabLeftRightPadding,
};

export const getTabListStyles = (): SerializedStyles =>
  // eslint-disable-next-line @repo/internal/styles/no-exported-styles
  css({
    '& [role="tab"]': getTabStyles(),
    fontWeight: token('font.weight.medium', '500'),
    '&::before': {
      ...tabLineStyles,
      height: underlineHeight,
      // This line is not a border so the selected line is visible in high contrast mode
      backgroundColor: tabLineColors.lineColor,
    },
  });

export const getTabStyles = (): CSSObject => {
  const colors = tabColors;
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
        borderBottom: `${underlineHeight} solid ${tabLineColors.hoveredColor}`,
        height: 0,
      },
    },

    '&:active': {
      // TODO: interaction states will be reviewed in DSP-1438
      color: colors.activeLabelColor,
      '&::after': {
        ...tabLineStyles,
        borderBottom: `${underlineHeight} solid ${tabLineColors.activeColor}`,
        height: 0,
      },
    },

    '&[aria-selected="true"]': {
      color: colors.selectedColor,
      '&::after': {
        ...tabLineStyles,
        // This line is a border so it is visible in high contrast mode
        borderBottom: `${underlineHeight} solid ${tabLineColors.selectedColor}`,
        height: 0,
      },
    },
  };
};
