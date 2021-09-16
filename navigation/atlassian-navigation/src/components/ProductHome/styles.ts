import { CSSObject } from '@emotion/core';

import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';

import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
import { skeletonCSS } from '../../common/styles';
import { NavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const productHomeButtonCSS = ({
  mode: { primaryButton },
}: NavigationTheme): CSSObject => {
  return {
    alignItems: 'center',
    padding: gridSize / 2,
    borderRadius: 3,
    border: 0,
    background: 'none',
    display: 'flex',
    cursor: 'pointer',
    color: 'inherit',
    '&:first-of-type': {
      marginLeft: 0,
    },
    '&::-moz-focus-inner': {
      border: 0,
    },
    '&:hover': primaryButton.hover,
    '&:focus': { ...(primaryButton.focus as CSSObject), outline: 0 },
    '&:active': primaryButton.active,
    'div&': {
      pointerEvents: 'none',
    },
    [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
      margin: `0 ${gridSize}px`,
    },
    [`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
      margin: `0 ${gridSize * 2}px`,
    },
  };
};

export const productHomeButtonSkeletonCSS = productHomeButtonCSS;

const iconHeight = 28;

const heightCSS = {
  maxHeight: `${iconHeight}px`,
};

export const productIconCSS = {
  // Ensure anything passed into
  // productHome is aligned correctly
  display: 'flex',
  '& > *': {
    maxHeight: 24,
  },
  [`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
    display: 'none',
  },
};

export const productIconSkeletonCSS = (theme: NavigationTheme) => ({
  borderRadius: '50%',
  width: `${iconHeight}px`,
  height: `${iconHeight}px`,
  ...productIconCSS,
  ...skeletonCSS(theme),
});

export const customProductIconCSS = {
  ...heightCSS,
  ...productIconCSS,
};

export const productLogoCSS = (logoMaxWidth: number) => ({
  // Ensure anything passed into
  // productHome is aligned correctly
  display: 'flex',
  maxWidth: logoMaxWidth,
  '& > *': {
    maxHeight: 24,
  },
  [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
    display: 'none',
  },
});

export const siteTitleCSS = ({
  mode: {
    navigation: { color },
    productHome: { borderRight },
  },
}: NavigationTheme) => ({
  marginLeft: `${gridSize * 0.5}px`,
  display: 'flex',
  alignItems: 'center',
  paddingRight: gridSize * 2,
  marginRight: gridSize / 2,
  borderRight: borderRight,
});

export const siteTitleSkeletonCSS = (theme: NavigationTheme) => ({
  ...siteTitleCSS(theme),
  ...skeletonCSS(theme),
  width: gridSize * 5,
  backgroundColor: 'transparent',

  '&:after': {
    content: '""',
    width: '100%',
    height: iconHeight / 2,
    backgroundColor: theme.mode.skeleton.backgroundColor,
    borderRadius: 4,
  },
});

export const productLogoSkeletonCSS = (theme: NavigationTheme) => ({
  width: '120px',
  height: 24,
  ...heightCSS,
  ...productLogoCSS(120),
  ...skeletonCSS(theme),
});

export const customProductLogoCSS = (logoMaxWidth: number) => ({
  ...heightCSS,
  ...productLogoCSS(logoMaxWidth),
});
