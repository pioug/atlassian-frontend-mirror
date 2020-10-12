/** @jsx jsx */
import { Fragment, MouseEvent } from 'react';

import { jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import {
  productHomeButtonCSS,
  productIconCSS,
  productLogoCSS,
  siteTitleCSS,
} from './styles';
import { ProductHomeProps } from './types';
import { getTag } from './utils';

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

  return (
    <Fragment>
      <Tag
        css={productHomeButtonCSS(theme)}
        href={href}
        onClick={onClick}
        onMouseDown={preventFocusRing}
        data-testid={testId && `${testId}-container`}
        {...rest}
      >
        <div
          css={productLogoCSS(logoMaxWidth)}
          data-testid={testId && `${testId}-logo`}
        >
          <Logo
            iconGradientStart={iconGradientStart}
            iconGradientStop={iconGradientStop}
            iconColor={iconColor}
            textColor={textColor}
          />
        </div>
        <div css={productIconCSS} data-testid={testId && `${testId}-icon`}>
          <Icon
            iconGradientStart={iconGradientStart}
            iconGradientStop={iconGradientStop}
            iconColor={iconColor}
          />
        </div>
      </Tag>
      {siteTitle && (
        <div
          css={siteTitleCSS(theme)}
          data-testid={testId && `${testId}-site-title`}
        >
          {siteTitle}
        </div>
      )}
    </Fragment>
  );
};

export default ProductHome;
