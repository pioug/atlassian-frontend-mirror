/** @jsx jsx */

import { Fragment } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize, PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
import { useTheme } from '../../theme';

const VAR_PRODUCT_HOME_COLOR_ACTIVE = '--product-home-color-active';
const VAR_PRODUCT_HOME_BACKGROUND_COLOR_ACTIVE =
  '--product-home-bg-color-active';
const VAR_PRODUCT_HOME_BOX_SHADOW_ACTIVE = '--product-home-box-shadow-active';

const VAR_PRODUCT_HOME_COLOR_FOCUS = '--product-home-color-focus';
const VAR_PRODUCT_HOME_BACKGROUND_COLOR_FOCUS = '--product-home-bg-color-focus';
const VAR_PRODUCT_HOME_BOX_SHADOW_FOCUS = '--product-home-box-shadow-focus';

const VAR_PRODUCT_HOME_COLOR_HOVER = '--product-home-color-hover';
const VAR_PRODUCT_HOME_BACKGROUND_COLOR_HOVER = '--product-home-bg-color-hover';
const VAR_PRODUCT_HOME_BOX_SHADOW_HOVER = '--product-home-box-shadow-hover';

const VAR_SITE_TITLE_BG_COLOR_AFTER = '--site-title-bg-color-after';

const productHomeButtonStyles = css({
  display: 'flex',
  padding: gridSize / 2,
  alignItems: 'center',
  background: 'none',
  border: 0,
  borderRadius: 3,
  color: 'inherit',
  cursor: 'pointer',
  '&::-moz-focus-inner': {
    border: 0,
  },
  '&:first-of-type': {
    marginLeft: 0,
  },
  '&:active': {
    backgroundColor: `var(${VAR_PRODUCT_HOME_BACKGROUND_COLOR_ACTIVE})`,
    boxShadow: `var(${VAR_PRODUCT_HOME_BOX_SHADOW_ACTIVE})`,
    color: `var(${VAR_PRODUCT_HOME_COLOR_ACTIVE})`,
  },
  '&:focus': {
    backgroundColor: `var(${VAR_PRODUCT_HOME_BACKGROUND_COLOR_FOCUS})`,
    boxShadow: `var(${VAR_PRODUCT_HOME_BOX_SHADOW_FOCUS})`,
    color: `var(${VAR_PRODUCT_HOME_COLOR_FOCUS})`,
    outline: 0,
  },
  '&:hover': {
    backgroundColor: `var(${VAR_PRODUCT_HOME_BACKGROUND_COLOR_HOVER})`,
    boxShadow: `var(${VAR_PRODUCT_HOME_BOX_SHADOW_HOVER})`,
    color: `var(${VAR_PRODUCT_HOME_COLOR_HOVER})`,
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  'div&': {
    pointerEvents: 'none',
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
    margin: `0 ${gridSize}px`,
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
    margin: `0 ${gridSize * 2}px`,
  },
});

const productLogoStyles = css({
  display: 'flex',
  width: 120,
  maxWidth: 120,
  height: 24,
  maxHeight: 28,
  opacity: 0.15,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > *': {
    maxHeight: 24,
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
    display: 'none',
  },
});

const productIconStyles = css({
  display: 'flex',
  width: 28,
  height: 28,
  borderRadius: '50%',
  opacity: 0.15,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > *': {
    maxHeight: 24,
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
    display: 'none',
  },
});

const siteTitleStyles = css({
  display: 'flex',
  width: gridSize * 5,
  marginRight: gridSize / 2,
  marginLeft: gridSize * 0.5,
  paddingRight: gridSize * 2,
  alignItems: 'center',
  backgroundColor: 'transparent',
  '&:after': {
    width: '100%',
    height: 14,
    backgroundColor: `var(${VAR_SITE_TITLE_BG_COLOR_AFTER})`,
    borderRadius: 4,
    content: '""',
  },
});

// Not exported to consumers, only used in NavigationSkeleton
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const ProductHomeSkeleton = ({
  showSiteName,
}: {
  showSiteName: boolean;
}) => {
  const theme = useTheme();
  const primaryButton = theme.mode.primaryButton;

  const productHomeButtonDynamicStyles = {
    [VAR_PRODUCT_HOME_COLOR_ACTIVE]: primaryButton.active.color,
    [VAR_PRODUCT_HOME_BACKGROUND_COLOR_ACTIVE]:
      primaryButton.active.backgroundColor,
    [VAR_PRODUCT_HOME_BOX_SHADOW_ACTIVE]: primaryButton.active.boxShadow,
    [VAR_PRODUCT_HOME_COLOR_FOCUS]: primaryButton.focus.color,
    [VAR_PRODUCT_HOME_BACKGROUND_COLOR_FOCUS]:
      primaryButton.focus.backgroundColor,
    [VAR_PRODUCT_HOME_BOX_SHADOW_FOCUS]: primaryButton.focus.boxShadow,
    [VAR_PRODUCT_HOME_COLOR_HOVER]: primaryButton.hover.color,
    [VAR_PRODUCT_HOME_BACKGROUND_COLOR_HOVER]:
      primaryButton.hover.backgroundColor,
    [VAR_PRODUCT_HOME_BOX_SHADOW_HOVER]: primaryButton.hover.boxShadow,
    [VAR_SITE_TITLE_BG_COLOR_AFTER]: theme.mode.skeleton.backgroundColor,
  };

  const siteTitleDynamicStyles = {
    borderRight: theme.mode.productHome.borderRight,
    opacity: theme.mode.skeleton.opacity,
    [VAR_SITE_TITLE_BG_COLOR_AFTER]: theme.mode.skeleton.backgroundColor,
  };

  return (
    <Fragment>
      <div
        style={productHomeButtonDynamicStyles as React.CSSProperties}
        css={productHomeButtonStyles}
      >
        <div
          style={theme.mode.skeleton as React.CSSProperties}
          css={productLogoStyles}
        />
        <div
          style={theme.mode.skeleton as React.CSSProperties}
          css={productIconStyles}
        />
      </div>
      {showSiteName && (
        <div
          style={siteTitleDynamicStyles as React.CSSProperties}
          css={siteTitleStyles}
        />
      )}
    </Fragment>
  );
};
