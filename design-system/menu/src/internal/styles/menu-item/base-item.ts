import { CSSObject } from '@emotion/core';

import { B100, N20, N200, N30, N800 } from '@atlaskit/theme/colors';
import {
  fontSize as fontSizeFn,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';

const gridSize = gridSizeFn();
const fontSize = fontSizeFn();

const itemTopBottomPadding = gridSize;
const itemSidePadding = gridSize * 2.5;
const itemElemSpacing = gridSize * 1.5;
const itemDescriptionSpacing = gridSize * 0.375;
const itemMinHeight = gridSize * 5;
const itemContentMinHeight = itemMinHeight - itemTopBottomPadding * 2;

const disabledStyles = {
  cursor: 'not-allowed',
  '&, &:hover, &:focus, &:active': {
    backgroundColor: 'transparent',
    color: N200,
  },
  '&:focus': {
    boxShadow: 'none',
  },
};

const selectedStyles = {
  backgroundColor: N20,
  textDecoration: 'none',
};

export const baseItemCSS = (
  isDisabled?: boolean,
  isSelected?: boolean,
): CSSObject => ({
  padding: `${itemTopBottomPadding}px ${itemSidePadding}px`,
  cursor: 'pointer',
  fontSize: fontSize,
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
    boxShadow: `${B100} 0 0 0 2px inset`,
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

export const wrapTextCSS = {
  wordBreak: 'break-word',
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

const descriptionBaseCSS = {
  color: N200,
  marginTop: itemDescriptionSpacing,
  fontSize: headingSizes.h200.size,
} as CSSObject;

export const wrapDescriptionCSS = {
  ...wrapTextCSS,
  ...descriptionBaseCSS,
} as CSSObject;

export const descriptionCSS = {
  ...truncateCSS,
  ...descriptionBaseCSS,
} as CSSObject;

export const contentCSSWrapper = {
  display: 'flex',
  minHeight: itemContentMinHeight,
  alignItems: 'center',
  // IE11 fix - used with flex above to fix vertical centering.
  width: '100%',
} as const;
