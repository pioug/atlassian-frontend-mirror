/** @jsx jsx */
import { Fragment, MouseEvent } from 'react';

import { css, jsx } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
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
  padding: token('space.050', '4px'),
  alignItems: 'center',
  background: 'none',
  border: 0,
  borderRadius: token('border.radius', '3px'),
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
  '&:focus-visible': {
    backgroundColor: `var(${VAR_PRODUCT_HOME_BACKGROUND_COLOR_FOCUS})`,
    color: `var(${VAR_PRODUCT_HOME_COLOR_FOCUS})`,
    outline: `${token('border.width.outline', '2px')} solid ${token(
      'color.border.focused',
      '#4C9AFF',
    )}`,
  },

  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  'div&': {
    pointerEvents: 'none',
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
    margin: `0 ${token('space.100', '8px')}`,
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  [`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
    margin: `0 ${token('space.200', '16px')}`,
  },
});

const productLogoStyles = css({
  // Ensure anything passed into
  // productHome is aligned correctly
  display: 'flex',
  maxWidth: `var(${VAR_LOGO_MAX_WIDTH})`,
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '& > *': {
    maxHeight: 24,
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '& > span > svg': {
    maxWidth: `var(${VAR_LOGO_MAX_WIDTH})`,
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
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
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '& > *': {
    maxHeight: 24,
  },
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  [`@media (min-width: ${PRODUCT_HOME_BREAKPOINT}px)`]: {
    display: 'none',
  },
});

const siteTitleStyles = css({
  display: 'flex',
  // Overridden in PFF styles applied below; consolidate in FF cleanup
  marginRight: token('space.050', '4px'),
  marginLeft: token('space.050', '4px'),
  paddingRight: token('space.200', '16px'),
  alignItems: 'center',
});

// When cleaning up feature flag, these styles can be moved into the above block
const featureFlaggedSiteTitleStyles = css({
  // Under the FF, we've made the site title handle it's spacing, with the
  // PrimaryItemsContainer not needing to worry about its paddingInlineStart.
  // This makes it cleaner for the title styles to appear and disappear with mq's
  marginRight: token('space.100', '8px'),
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  [`@media (max-width: ${PRODUCT_HOME_BREAKPOINT - 0.1}px)`]: {
    display: 'none',
  },
});

/**
 * __Product home__
 *
 * The ProductHome component displays the product visual identity composed of:
 * logo, icon, and optional text. Values for logo and icon are never displayed
 * at the same time, where icon is used only when space is restricted. Should be
 * passed into `AtlassianNavigation`'s `renderProductHome` prop.
 *
 * - [Examples](https://atlassian.design/components/atlassian-navigation/examples#product-home)
 * - [Code](https://atlassian.design/components/atlassian-navigation/code)
 */
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
    [VAR_LOGO_MAX_WIDTH]: `${logoMaxWidth}px`,
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
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...rest}
      >
        <div
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
          css={[
            siteTitleStyles,
            getBooleanFF(
              'platform.design-system-team.navigation-v2-no-jank_5yhbd',
            ) && featureFlaggedSiteTitleStyles,
          ]}
          data-testid={testId && `${testId}-site-title`}
        >
          {siteTitle}
        </div>
      )}
    </Fragment>
  );
};

export default ProductHome;
