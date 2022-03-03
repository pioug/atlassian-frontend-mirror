/** @jsx jsx */
import { Fragment, MouseEvent } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize, PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
import { useTheme } from '../../theme';

import { ProductHomeProps } from './types';
import { getTag } from './utils';

const VAR_LOGO_MAX_WIDTH = '--logo-max-width';

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
  '&:hover': {
    backgroundColor: `var(${VAR_PRODUCT_HOME_BACKGROUND_COLOR_HOVER})`,
    boxShadow: `var(${VAR_PRODUCT_HOME_BOX_SHADOW_HOVER})`,
    color: `var(${VAR_PRODUCT_HOME_COLOR_HOVER})`,
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
  // Ensure anything passed into
  // productHome is aligned correctly
  display: 'flex',
  maxWidth: `var(${VAR_LOGO_MAX_WIDTH})`,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '& > *': {
    maxHeight: 24,
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
    display: 'none',
  },
});

const customMaxHeightStyles = css({
  maxHeight: 28,
});

const productIconStyles = css({
  // Ensure anything passed into
  // productHome is aligned correctly
  display: 'flex',
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
  marginRight: gridSize / 2,
  marginLeft: gridSize * 0.5,
  paddingRight: gridSize * 2,
  alignItems: 'center',
});

const ProductHome = ({
  icon: Icon,
  logo: Logo,
  siteTitle,
  onClick,
  href,
  onMouseDown,
  testId,
  logoMaxWidth = 260,
  ...rest
}: ProductHomeProps) => {
  const theme = useTheme();
  const primaryButton = theme.mode.primaryButton;
  const {
    iconColor = 'inherit',
    iconGradientStart = 'inherit',
    iconGradientStop = 'inherit',
    textColor = theme.mode.productHome.color,
  } = theme.mode.productHome;

  const Tag = getTag(onClick, href);

  const preventFocusRing = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onMouseDown && onMouseDown(e);
  };

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
  };

  return (
    <Fragment>
      <Tag
        style={productHomeButtonDynamicStyles as React.CSSProperties}
        css={productHomeButtonStyles}
        href={href}
        onClick={onClick}
        onMouseDown={preventFocusRing}
        data-testid={testId && `${testId}-container`}
        {...rest}
      >
        <div
          style={{ [VAR_LOGO_MAX_WIDTH]: logoMaxWidth } as React.CSSProperties}
          css={[customMaxHeightStyles, productLogoStyles]}
          data-testid={testId && `${testId}-logo`}
        >
          <Logo
            iconGradientStart={iconGradientStart}
            iconGradientStop={iconGradientStop}
            iconColor={iconColor}
            textColor={textColor}
          />
        </div>
        <div
          style={{ [VAR_LOGO_MAX_WIDTH]: logoMaxWidth } as React.CSSProperties}
          css={[customMaxHeightStyles, productIconStyles]}
          data-testid={testId && `${testId}-icon`}
        >
          <Icon
            iconGradientStart={iconGradientStart}
            iconGradientStop={iconGradientStop}
            iconColor={iconColor}
          />
        </div>
      </Tag>
      {siteTitle && (
        <div
          style={
            {
              borderRight: theme.mode.productHome.borderRight,
            } as React.CSSProperties
          }
          css={siteTitleStyles}
          data-testid={testId && `${testId}-site-title`}
        >
          {siteTitle}
        </div>
      )}
    </Fragment>
  );
};

export default ProductHome;
