/** @jsx jsx */
import { Fragment, MouseEvent } from 'react';

import { jsx } from '@emotion/core';

import { useTheme } from '../../theme';

import {
  customProductIconCSS,
  customProductLogoCSS,
  productHomeButtonCSS,
  siteTitleCSS,
} from './styles';
import { CustomProductHomeProps } from './types';
import { getTag } from './utils';

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
  const Tag = getTag(onClick, href);

  const preventFocusRing = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onMouseDown && onMouseDown(event);
  };

  return (
    <Fragment>
      <Tag
        href={href}
        css={productHomeButtonCSS(theme)}
        onClick={onClick}
        onMouseDown={preventFocusRing}
        data-testid={testId && `${testId}-container`}
        {...rest}
      >
        {logoUrl && (
          <img
            css={customProductLogoCSS(logoMaxWidth)}
            src={logoUrl}
            alt={logoAlt}
            data-testid={testId && `${testId}-logo`}
          />
        )}
        {iconUrl && (
          <img
            css={customProductIconCSS}
            src={iconUrl}
            alt={iconAlt}
            data-testid={testId && `${testId}-icon`}
          />
        )}
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

export default CustomProductHome;
