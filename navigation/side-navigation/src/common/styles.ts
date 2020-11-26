import { CSSObject } from '@emotion/core';

import { CSSFn, StatelessCSSFn } from '@atlaskit/menu';
import {
  borderRadius as borderRadiusFn,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';

import {
  itemActiveBackgroundColor,
  itemHoverBackgroundColor,
  itemTextColor,
  itemTextSelectedColor,
  navigationBackgroundColor,
} from './constants';

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

export const baseSideNavItemStyle: CSSFn = ({ isSelected, isDisabled }) => {
  let backgroundColor = navigationBackgroundColor;
  let color = itemTextColor;

  if (isSelected) {
    backgroundColor = itemHoverBackgroundColor;
    color = itemTextSelectedColor;
  }

  if (isDisabled) {
    backgroundColor = `${navigationBackgroundColor} !important`;
  }

  return {
    // This padding is set to ensure that the center of the left icon
    // is approximately center aligned with the horizontal app switcher.
    padding: `${gridSize}px ${ITEM_SIDE_PADDING}px`,
    borderRadius,
    backgroundColor,
    color,
    '&:hover': {
      backgroundColor: itemHoverBackgroundColor,
      textDecoration: 'none',
      color,
    },
    '&:active': {
      color: itemTextSelectedColor,
      backgroundColor: itemActiveBackgroundColor,
      boxShadow: 'none',
    },
    ['& [data-item-elem-before]']: {
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

export const backItemStyle: CSSFn = () => {
  return {
    '&:hover': {
      backgroundColor: itemHoverBackgroundColor,
    },
  };
};

export const sectionHeaderStyle: StatelessCSSFn = () => {
  return {
    paddingLeft: `${ITEM_SIDE_PADDING}px`,
    paddingRight: `${ITEM_SIDE_PADDING}px`,
  };
};
