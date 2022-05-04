/** @jsx jsx */
import React, { useMemo } from 'react';
import { css, jsx, SerializedStyles } from '@emotion/core';

import Tooltip from '@atlaskit/tooltip';

import { SmartLinkSize, SmartLinkTheme } from '../../../../../constants';

import { LinkProps } from './types';
import {
  getLinkLineHeight,
  getLinkSizeStyles,
  getTruncateStyles,
  hasWhiteSpace,
} from '../../utils';
import { tokens } from '../../../../../utils/token';

const DEFAULT_MAX_LINES = 2;
const MAXIMUM_MAX_LINES = 2;
const MINIMUM_MAX_LINES = 1;

const containerStyles = css`
  flex: 1 1 auto;
`;

const getThemeStyles = (theme: SmartLinkTheme): SerializedStyles => {
  switch (theme) {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    case SmartLinkTheme.Black:
      return css`
        color: ${tokens.blackLink};
        :active {
          color: ${tokens.blackLinkPressed};
        }
        :hover {
          color: ${tokens.blackLink};
          text-decoration: underline;
        }
      `;
    case SmartLinkTheme.Link:
    default:
      return css`
        color: ${tokens.blueLink};
        :active {
          color: ${tokens.blueLinkPressed};
        }
        :hover {
          color: ${tokens.blueLink};
          text-decoration: underline;
        }
      `;
  }
};

const getAnchorStyles = (
  size: SmartLinkSize,
  theme: SmartLinkTheme,
  maxLines: number,
  hasSpace: boolean,
): SerializedStyles => {
  const sizeStyles = getLinkSizeStyles(size);
  return css`
    flex: 1 1 auto;
    ${sizeStyles}
    ${getTruncateStyles(
      maxLines,
      getLinkLineHeight(size),
      hasSpace ? 'break-word' : 'break-all',
    )}
    // Theme should be last to be spread because it contains override values
    ${getThemeStyles(
      theme,
    )}
  `;
};

const getMaxLines = (maxLines: number) => {
  if (maxLines > MAXIMUM_MAX_LINES) {
    return DEFAULT_MAX_LINES;
  }

  if (maxLines < MINIMUM_MAX_LINES) {
    return MINIMUM_MAX_LINES;
  }

  return maxLines;
};

/**
 * An element that represent.
 * @public
 * @param {LinkProps} LinkProps - The props necessary for the Icon element.
 * @see LinkIcon
 */
const Link: React.FC<LinkProps> = ({
  maxLines = DEFAULT_MAX_LINES,
  overrideCss,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-link',
  text,
  theme = SmartLinkTheme.Link,
  url,
  onClick,
  target,
}) => {
  const hasSpace = useMemo(() => (text ? hasWhiteSpace(text) : false), [text]);
  return (
    <span css={containerStyles}>
      <Tooltip content={text} testId={`${testId}-tooltip`} tag="span">
        <a
          css={[
            getAnchorStyles(size, theme, getMaxLines(maxLines), hasSpace),
            overrideCss,
          ]}
          data-smart-element-link
          data-testid={testId}
          onClick={onClick}
          href={url}
          target={target || '_blank'}
        >
          {text}
        </a>
      </Tooltip>
    </span>
  );
};

export default Link;
