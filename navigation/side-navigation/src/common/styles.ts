import { CSSObject } from '@emotion/core';

import { CSSFn, StatelessCSSFn } from '@atlaskit/menu';
import { B400, B50, N10, N30, N500 } from '@atlaskit/theme/colors';
import {
  borderRadius as borderRadiusFn,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

const gridSize = gridSizeFn();
const borderRadius = borderRadiusFn();
const itemIconSize = gridSize * 3;
const leftIconRightSpacing = gridSize * 2;

export const ITEM_SIDE_PADDING = gridSize * 1.25;

/**
 * Allows chaining of style functions on top of base style functions
 * @param baseStyle the base custom cssFn
 * @param newStyle a new cssFn to be applied after the base style
 */
export const overrideStyleFunction = <TState>(
  baseStyle: CSSFn<TState>,
  newStyle: CSSFn<TState> | undefined = () => ({}),
): CSSFn<TState> => {
  return (state: TState) => {
    return [baseStyle(state), newStyle(state)] as CSSObject[];
  };
};

const defaultStyles = {
  '&:hover': {
    color: token('color.text.mediumEmphasis', N500),
    backgroundColor: token('color.background.transparentNeutral.hover', N30),
  },
  '&:active': {
    color: token('color.text.mediumEmphasis', B400),
    backgroundColor: token('color.background.transparentNeutral.pressed', B50),
  },
};

const selectedStyles = {
  backgroundColor: token('color.background.selected.resting', N30),
  color: token('color.text.selected', B400),
  ':visited': {
    color: token('color.text.selected', B400),
  },
  '&:hover': {
    backgroundColor: token('color.background.selected.hover', N30),
    color: token('color.text.selected', N500),
  },
  '&:active': {
    backgroundColor: token('color.background.selected.pressed', B50),
    color: token('color.text.selected', B400),
  },
};

export const baseSideNavItemStyle: CSSFn = ({ isSelected, isDisabled }) => {
  return {
    // This padding is set to ensure that the center of the left icon
    // is approximately center aligned with the horizontal app switcher.
    padding: `${gridSize}px ${ITEM_SIDE_PADDING}px`,
    borderRadius,

    // -- TODO: DELETE THESE COLOR OVERRIDES WHEN CLEANING UP FALLBACK THEMING --
    // Menu and side navigation are now color aligned so they do not need this!
    // See: https://product-fabric.atlassian.net/browse/DSP-1684
    backgroundColor: token('color.background.default', N10),
    ...(!isDisabled && !isSelected && defaultStyles),
    ...(!isDisabled && isSelected && selectedStyles),
    // -- END TODO --------------------------------------------------------------

    ['& [data-item-elem-before]']: {
      // TODO: Can this be moved into menu?
      // center align icons with app-switcher regardless of size
      display: 'flex',
      height: itemIconSize,
      width: itemIconSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: leftIconRightSpacing,
    },
  };
};

export const sectionHeaderStyle: StatelessCSSFn = () => {
  return {
    paddingLeft: `${ITEM_SIDE_PADDING}px`,
    paddingRight: `${ITEM_SIDE_PADDING}px`,
  };
};
