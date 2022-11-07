/** @jsx jsx */
import { Fragment, MouseEvent } from 'react';

import { css, jsx } from '@emotion/react';

import { gridSize, PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
import { useTheme } from '../../theme';

import { CustomProductHomeProps } from './types';
import { getTag } from './utils';

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

const productLogoStyles = css({
  // Ensure anything passed into
  // productHome is aligned correctly
  display: 'flex',
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
  [`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
    display: 'none',
  },
});

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

const siteTitleStyles = css({
  display: 'flex',
  marginRight: gridSize / 2,
  marginLeft: gridSize * 0.5,
  paddingRight: gridSize * 2,
  alignItems: 'center',
});

/**
 * __Custom product home__
 *
 * Use `CustomProductHome` to provide a custom logo and icon with URLs.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#custom-product-home)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
const CustomProductHome = (props: CustomProductHomeProps) => {
  const {
    iconAlt,
    iconUrl,
    logoAlt,
    logoUrl,
    href,
    onClick,
    siteTitle,
    onMouseDown,
    testId,
    logoMaxWidth = 260,
    ...rest
  } = props;
  const theme = useTheme();
  const primaryButton = theme.mode.primaryButton;
  const Tag = getTag(onClick, href);

  const preventFocusRing = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onMouseDown && onMouseDown(event);
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
        href={href}
        style={productHomeButtonDynamicStyles as React.CSSProperties}
        css={productHomeButtonStyles}
        onClick={onClick}
        onMouseDown={preventFocusRing}
        data-testid={testId && `${testId}-container`}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...rest}
      >
        {logoUrl && (
          <img
            style={{ maxWidth: logoMaxWidth }}
            css={[customMaxHeightStyles, productLogoStyles]}
            src={logoUrl}
            alt={logoAlt}
            data-testid={testId && `${testId}-logo`}
          />
        )}
        {iconUrl && (
          <img
            style={{ maxWidth: logoMaxWidth }}
            css={[customMaxHeightStyles, productIconStyles]}
            src={iconUrl}
            alt={iconAlt}
            data-testid={testId && `${testId}-icon`}
          />
        )}
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

export default CustomProductHome;
