import { CSSObject, keyframes } from '@emotion/core';

import {
  B100,
  N20,
  N200,
  N30,
  N800,
  skeleton as skeletonColor,
  subtleHeading,
  subtleText,
} from '@atlaskit/theme/colors';
import {
  borderRadius,
  fontSize,
  gridSize as gridSizeFn,
  skeletonShimmer,
} from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';

import { Width } from '../types';

const gridSize = gridSizeFn();

const itemElemSpacing = gridSize * 1.5;
const itemExpectedElemSize = gridSize * 3;
const itemTopBottomPadding = gridSize;
const itemSidePadding = gridSize * 2.5;
const itemDescriptionSpacing = gridSize * 0.375;
const itemMinHeight = gridSize * 5;
const itemContentMinHeight = itemMinHeight - itemTopBottomPadding * 2;

const itemHeadingContentHeight = headingSizes.h100.lineHeight;
const itemHeadingFontSize = headingSizes.h100.size;

const skeletonItemElemSize = gridSize * 2.5;
const itemElemSkeletonOffset =
  (itemExpectedElemSize - skeletonItemElemSize) / 2;
const skeletonTextBorderRadius = 100;
const skeletonHeadingHeight = gridSize;
const skeletonContentHeight = 9;

const buttonOverrides = {
  backgroundColor: 'transparent',
  border: 0,
  outline: 0,
  margin: 0,
  width: '100%',
};

const anchorOverrides = {};

const customItemOverrides = {
  color: 'currentColor',
};

const disabledStyles = {
  cursor: 'not-allowed',
  '&, &:hover, &:focus, &:active': {
    backgroundColor: 'transparent',
    color: N200,
  },
};

const selectedStyles = {
  backgroundColor: N20,
  textDecoration: 'none',
};

const shimmer = skeletonShimmer();
const shimmerKeyframes = keyframes(shimmer.keyframes);

const baseItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  padding: `${itemTopBottomPadding}px ${itemSidePadding}px`,
  cursor: 'pointer',
  fontSize: fontSize(),
  // IE11 fix - wrapping container needs to be flex as well for vertical centering to work.
  display: 'flex',
  boxSizing: 'border-box',
  color: N800,
  userSelect: 'none',

  '&:visited': {
    color: N800,
  },
  '&:hover': {
    color: N800,
    backgroundColor: N20,
    textDecoration: 'none',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: isDisabled ? 'none' : `${B100} 0 0 0 2px inset`,
  },
  '&:active': {
    boxShadow: 'none',
    color: N800,
    backgroundColor: N30,
  },
  '::-moz-focus-inner': {
    border: 0,
  },
  ...(isSelected && selectedStyles),
  ...(isDisabled && disabledStyles),
});

export const buttonItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  ...buttonOverrides,
  ...baseItemCSS(isDisabled, isSelected),
});

export const itemCSS = baseItemCSS;

export const contentCSS = {
  flexGrow: 1,
  textAlign: 'left',
  overflow: 'hidden',
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  // Fix - avoid clipped text descenders when using standard 16px line-height
  lineHeight: 1.22,
} as CSSObject;

export const truncateCSS = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as CSSObject;

export const elemBeforeCSS = {
  display: 'flex',
  flexShrink: 0,
  marginRight: itemElemSpacing,
};

export const elemAfterCSS = {
  display: 'flex',
  flexShrink: 0,
  marginLeft: itemElemSpacing,
};

export const descriptionCSS = {
  ...truncateCSS,
  color: subtleText(),
  marginTop: itemDescriptionSpacing,
  fontSize: headingSizes.h200.size,
} as CSSObject;

export const contentCSSWrapper = {
  display: 'flex',
  minHeight: itemContentMinHeight,
  alignItems: 'center',
  // IE11 fix - used with flex above to fix vertical centering.
  width: '100%',
} as const;

export const linkItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  ...anchorOverrides,
  ...baseItemCSS(isDisabled, isSelected),
});

export const customItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  ...customItemOverrides,
  ...baseItemCSS(isDisabled, isSelected),
});

export const itemHeadingCSS = {
  textTransform: 'uppercase',
  fontSize: itemHeadingFontSize,
  lineHeight: itemHeadingContentHeight / itemHeadingFontSize,
  fontWeight: 700,
  color: subtleHeading(),
  padding: `0 ${itemSidePadding}px`,
} as CSSObject;

export const skeletonHeadingItemCSS = (
  width?: Width,
  isShimmering?: boolean,
): CSSObject => ({
  ...itemHeadingCSS,
  '&::after': {
    // This renders the skeleton heading "text".
    backgroundColor: skeletonColor(),
    ...(isShimmering && {
      ...shimmer.css,
      animationName: `${shimmerKeyframes}`,
    }),
    height: skeletonHeadingHeight,
    width: width || '30%',
    borderRadius: skeletonTextBorderRadius,
    display: 'block',
    content: '""',
  },
});

export const itemSkeletonCSS = (
  hasAvatar?: boolean,
  hasIcon?: boolean,
  width?: string | number,
  isShimmering?: boolean,
): CSSObject => ({
  ...itemCSS(false, false),
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  minHeight: itemMinHeight,

  // Stagger alternate skeleton items if no width is passed
  ...(!width && {
    '&:nth-child(1n)::after': {
      flexBasis: '70%',
    },
    '&:nth-child(2n)::after': {
      flexBasis: '50%',
    },
    '&:nth-child(3n)::after': {
      flexBasis: '60%',
    },
    '&:nth-child(4n)::after': {
      flexBasis: '90%',
    },
    '&:nth-child(5n)::after': {
      flexBasis: '35%',
    },
    '&:nth-child(6n)::after': {
      flexBasis: '77%',
    },
  }),

  ...((hasAvatar || hasIcon) && {
    '&::before': {
      // This will render a skeleton in the "elemBefore" position.
      content: '""',
      backgroundColor: skeletonColor(),
      ...(isShimmering && {
        ...shimmer.css,
        animationName: `${shimmerKeyframes}`,
      }),
      marginRight: itemElemSpacing + itemElemSkeletonOffset,
      width: skeletonItemElemSize,
      height: skeletonItemElemSize,
      marginLeft: itemElemSkeletonOffset,
      borderRadius: hasAvatar ? '100%' : borderRadius(),
      flexShrink: 0,
    },
  }),

  '&::after': {
    // This will render the skeleton "text".
    content: '""',
    backgroundColor: skeletonColor(),
    ...(isShimmering && {
      ...shimmer.css,
      animationName: `${shimmerKeyframes}`,
    }),
    // This is a little bespoke but we need to push everything down 1px
    //  because the skeleton content should align to the bottom of the text.
    // Confirm VR test failures before accepting a change.
    marginTop: 1,
    height: skeletonContentHeight,
    borderRadius: skeletonTextBorderRadius,
    flexBasis: width || '100%',
  },
});
