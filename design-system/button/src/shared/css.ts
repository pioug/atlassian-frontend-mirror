import { CSSObject } from '@emotion/core';

import {
  borderRadius as getBorderRadius,
  fontSize as getFontSize,
  gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import { Appearance, Spacing } from '../types';

import colors, { ColorGroup, ColorRule } from './colors';

const borderRadius: number = getBorderRadius();
const gridSize: number = getGridSize();
const fontSize: number = getFontSize();

// ## Button layout
//
// /------------------------------------------------------------------------------------------------------------------\
// |       →  |  ←      |          |      →  |  ←      |           |      →  |  ←      |         |      →  |  ←       |
// |  10px →  |  ← 2px  |   icon   |  2px →  |  ← 2px  |           |  2px →  |  ← 2px  |  icon   |  2px →  |  ← 10px  |
// |  padding |  margin |  before  |  margin |  margin |  content  |  margin |  margin |  after  |  margin |  padding |
// |    (12px total)    |          |    (4px total)    |           |    (4px total)    |         |    (12px total)    |
// |       →  |  ←      |          |      →  |  ←      |           |      →  |  ←      |         |      →  |  ←       |
// \------------------------------------------------------------------------------------------------------------------/
//                                           ↑                               ↑
//                                        Margins don't collapse with inline-flex
//
const heights: { [key in Spacing]: string } = {
  default: `${(gridSize * 4) / fontSize}em`, // 32px
  compact: `${(gridSize * 3) / fontSize}em`,
  none: 'auto',
};
const lineHeights: { [key in Spacing]: string } = {
  default: heights.default,
  compact: heights.compact,
  none: 'inherit',
};
const padding: { [key in Spacing]: string } = {
  // 10px gutter
  default: `0 ${gridSize + gridSize / 4}px`,
  compact: `0 ${gridSize + gridSize / 4}px`,
  none: '0',
};
const singleIconPadding: { [key in Spacing]: string } = {
  // 2px gutter
  compact: `0 ${gridSize / 4}px`,
  default: `0 ${gridSize / 4}px`,
  none: '0',
};

const verticalAlign: { [key in Spacing]: string } = {
  default: 'middle',
  compact: 'middle',
  none: 'baseline',
};

const innerMargin = {
  content: `0 ${gridSize / 4}px`,
  icon: `0 ${gridSize / 4}px`,
};

function getColor({
  group,
  key,
  mode,
}: {
  group: ColorGroup;
  key: keyof ColorGroup;
  mode: ThemeModes;
}): string {
  const rule: ColorRule = group[key] || group.default;
  return rule[mode];
}

function getColors({
  appearance,
  key,
  mode,
}: {
  appearance: Appearance;
  key: keyof ColorGroup;
  mode: ThemeModes;
}) {
  return {
    background: getColor({
      group: colors.background[appearance],
      key,
      mode,
    }),
    // Needing to add !important to overcome specificity issue caused by deprecated AtlaskitThemeProvider
    color: `${getColor({
      group: colors.color[appearance],
      key,
      mode,
    })} !important`,
  };
}

export type GetCssArgs = {
  appearance: Appearance;
  spacing: Spacing;
  mode: ThemeModes;
  isSelected: boolean;
  shouldFitContainer: boolean;
  isOnlySingleIcon: boolean;
};

export function getCss({
  appearance,
  spacing,
  mode,
  isSelected,
  shouldFitContainer,
  isOnlySingleIcon,
}: GetCssArgs): CSSObject {
  const baseColors = getColors({
    appearance,
    key: isSelected ? 'selected' : 'default',
    mode,
  });

  return {
    // 0px margin added to css-reset
    alignItems: 'baseline',
    borderWidth: 0,
    borderRadius,
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontSize: 'inherit',
    fontStyle: 'normal',
    // Chrome recently changed button so that they use 'arial' as the font family
    fontFamily: 'inherit',
    fontWeight: 500,
    // margin for button has been applied to css reset
    maxWidth: '100%',
    // Needed to position overlay
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transition:
      'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
    whiteSpace: 'nowrap',

    // dynamic styles
    ...baseColors,

    cursor: 'pointer',
    height: heights[spacing],
    lineHeight: lineHeights[spacing],
    padding: isOnlySingleIcon ? singleIconPadding[spacing] : padding[spacing],
    verticalAlign: verticalAlign[spacing],
    width: shouldFitContainer ? '100%' : 'auto',
    // justifyContent required for shouldFitContainer buttons with an icon inside
    justifyContent: 'center',

    // Note: we cannot disable pointer events when there is an overlay.
    // That would be easy for styling, but it would start letting events through on disabled buttons

    // Disabling visited styles (just using the base colors)
    '&:visited': {
      ...baseColors,
    },

    '&:hover': {
      ...getColors({
        appearance,
        key: isSelected ? 'selected' : 'hover',
        mode,
      }),
      textDecoration:
        !isSelected && (appearance === 'link' || appearance === 'subtle-link')
          ? 'underline'
          : 'inherit',
      // background, box-shadow
      transitionDuration: '0s, 0.15s',
    },

    '&:focus': {
      ...getColors({
        appearance,
        key: isSelected ? 'focusSelected' : 'focus',
        mode,
      }),
      boxShadow: `0 0 0 2px ${colors.boxShadowColor[appearance].focus[mode]}`,
      // background, box-shadow
      transitionDuration: '0s, 0.2s',
      // disabling browser focus outline
      outline: 'none',
    },

    // giving active styles preference by listing them after focus
    '&:active': {
      ...getColors({
        appearance,
        key: isSelected ? 'selected' : 'active',
        mode,
      }),
      // background, box-shadow
      transitionDuration: '0s, 0s',
    },

    // preventDefault prevents regular active styles from applying in Firefox
    '&[data-firefox-is-active="true"]': {
      ...getColors({
        appearance,
        key: isSelected ? 'selected' : 'active',
        mode,
      }),
      // background, box-shadow
      transitionDuration: '0s, 0s',
    },

    // Giving disabled styles preference over active by listing them after.
    // Not using '&:disabled' because :disabled is not a valid state for all element types
    // so we are targeting the attribute
    // Attributes have the same specificity a pseudo classes so we are overriding :disabled here
    '&[disabled]': {
      // always using 'disabled' even when selected
      ...getColors({ appearance, key: 'disabled', mode }),
      cursor: 'not-allowed',
      textDecoration: 'none',
    },

    '&[data-has-overlay="true"]': {
      cursor: 'default',
      textDecoration: 'none',
    },

    // disabling hover and active color changes when there is an overlay, but the button is not disabled
    '&[data-has-overlay="true"]:not([disabled]):hover, &[data-has-overlay="true"]:not([disabled]):active': {
      ...getColors({
        appearance,
        key: isSelected ? 'selected' : 'default',
        mode,
      }),
    },

    '&::-moz-focus-inner': {
      border: 0,
      margin: 0,
      padding: 0,
    },
  };
}

// inline-flex child
export function getIconStyle({ spacing }: { spacing: Spacing }): CSSObject {
  return {
    alignSelf: 'center',
    display: 'flex',
    // icon size cannot grow and shrink
    flexGrow: 0,
    flexShrink: 0,

    lineHeight: 0,
    fontSize: 0,
    userSelect: 'none',
    margin: spacing === 'none' ? 0 : innerMargin.icon,
  };
}

// inline-flex child
export function getContentStyle({ spacing }: { spacing: Spacing }): CSSObject {
  return {
    margin: spacing === 'none' ? 0 : innerMargin.content,

    // content can grow and shrink
    flexGrow: 1,
    flexShrink: 1,

    // ellipsis for overflow text
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
}

export function getFadingCss({
  hasOverlay,
}: {
  hasOverlay: boolean;
}): CSSObject {
  return {
    transition: 'opacity 0.3s',
    opacity: hasOverlay ? 0 : 1,
  };
}

export const overlayCss: CSSObject = {
  // stretching to full width / height of button
  // this is important as we need it to still block
  // event if clicking in the button's own padding
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,

  // Putting all children in the center
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
