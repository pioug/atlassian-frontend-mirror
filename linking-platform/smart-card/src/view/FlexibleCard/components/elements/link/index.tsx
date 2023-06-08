/** @jsx jsx */
import React, { useMemo } from 'react';
import { css, jsx, SerializedStyles } from '@emotion/react';

import Tooltip from '@atlaskit/tooltip';

import {
  SmartLinkInternalTheme,
  SmartLinkSize,
  SmartLinkTheme,
} from '../../../../../constants';

import { LinkProps } from './types';
import {
  getLinkLineHeight,
  getLinkSizeStyles,
  getTruncateStyles,
  hasWhiteSpace,
} from '../../utils';
import { tokens } from '../../../../../utils/token';
import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';
import { token } from '@atlaskit/tokens';

const DEFAULT_MAX_LINES = 2;
const MAXIMUM_MAX_LINES = 2;
const MINIMUM_MAX_LINES = 1;

const containerStyles = css`
  flex: 1 1 auto;
`;

const getThemeStyles = (
  theme: SmartLinkTheme | SmartLinkInternalTheme,
): SerializedStyles => {
  switch (theme) {
    case SmartLinkInternalTheme.Grey:
      // We are being specifc with the CSS selectors to ensure that Confluence overrides
      // do not affect our internal Smart Card styles
      return css`
        a& {
          color: ${token('color.text.subtlest', '#626F86')};
          &:active,
          &:visited,
          &:focus,
          &:hover {
            color: ${token('color.text.subtlest', '#626F86')};
            text-decoration: underline;
          }
          font-size: 12px;
        }
      `;
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
  theme: SmartLinkTheme | SmartLinkInternalTheme,
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
    ${getThemeStyles(theme)}
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

const withTooltip = (
  trigger: React.ReactNode,
  content: string,
  testId: string,
) => (
  <Tooltip content={content} testId={`${testId}-tooltip`} tag="span">
    {trigger}
  </Tooltip>
);

/**
 * A base element that represent an anchor.
 * @internal
 * @param {LinkProps} LinkProps - The props necessary for the Link element.
 * @see LinkIcon
 */
const Link: React.FC<LinkProps> = ({
  hideTooltip,
  maxLines = DEFAULT_MAX_LINES,
  name,
  overrideCss,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-link',
  text,
  theme = SmartLinkTheme.Link,
  url,
  onClick,
  target = '_blank',
}) => {
  const onMouseDown = useMouseDownEvent();

  const hasSpace = useMemo(() => (text ? hasWhiteSpace(text) : false), [text]);

  const anchor = (
    <a
      css={[
        getAnchorStyles(size, theme, getMaxLines(maxLines), hasSpace),
        overrideCss,
      ]}
      data-smart-element={name}
      data-smart-element-link
      data-testid={testId}
      onClick={onClick}
      onMouseDown={onMouseDown}
      href={url}
      // We do not want set the target if it is the default value of '_self'. This prevents link
      // click issues in Confluence and Trello which rely on it not being set unless necessary.
      {...(target !== '_self' && { target })}
    >
      {text}
    </a>
  );

  return (
    <span css={containerStyles}>
      {hideTooltip || text === undefined
        ? anchor
        : withTooltip(anchor, text, testId)}
    </span>
  );
};

export default Link;
