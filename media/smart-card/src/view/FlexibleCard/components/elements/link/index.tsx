/** @jsx jsx */
import React from 'react';

import { B400, N800, N900, B500 } from '@atlaskit/theme/colors';
import { h200, h400, h600, h800 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';
import { css, jsx } from '@emotion/core';

import { SmartLinkSize, SmartLinkTheme } from '../../../../../constants';

import { LinkProps } from './types';

const DEFAULT_MAX_LINES = 2;
const MAXIMUM_MAX_LINES = 2;
const MINIMUM_MAX_LINES = 1;

const getSizeStyles = (size: SmartLinkSize) => {
  const overrides = { marginTop: 'unset' };
  switch (size) {
    case SmartLinkSize.XLarge:
      return { ...h800(), ...overrides };
    case SmartLinkSize.Large:
      return { ...h600(), ...overrides };
    case SmartLinkSize.Medium:
      return { ...h400(), ...overrides };
    case SmartLinkSize.Small:
    default:
      return { ...h200(), ...overrides };
  }
};

const getThemeStyles = (theme: SmartLinkTheme) => {
  switch (theme) {
    case SmartLinkTheme.Black:
      return {
        color: token('color.text.subtle', N800),
        fontWeight: 500,
        ':active': {
          color: token('color.text', N900),
        },
        ':hover': {
          color: token('color.text.subtle', N800),
          textDecoration: 'underline',
        },
      };
    case SmartLinkTheme.Link:
    default:
      return {
        color: token('color.link', B400),
        ':active': {
          color: token('color.link.pressed', B500),
        },
        ':hover': {
          color: token('color.link', B400),
          textDecoration: 'underline',
        },
      };
  }
};

const getTruncateStyles = (maxLines: number, lineHeight: number = 16) => ({
  display: '-webkit-box',
  flex: '1 1 auto',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word' as const,
  WebkitLineClamp: maxLines,
  WebkitBoxOrient: 'vertical' as const,
  // Fallback options.
  maxHeight: `${(maxLines * lineHeight).toFixed(3)}em`,
});

const getStyles = (
  size: SmartLinkSize,
  theme: SmartLinkTheme,
  maxLines: number,
) => {
  const sizeStyles = getSizeStyles(size);
  return css({
    ...sizeStyles,
    ...getTruncateStyles(maxLines, sizeStyles?.lineHeight),
    // Theme should be last to be spread because it contains override values
    ...getThemeStyles(theme),
  });
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

const Link: React.FC<LinkProps> = ({
  maxLines = DEFAULT_MAX_LINES,
  size = SmartLinkSize.Medium,
  testId = 'smart-element-link',
  text,
  theme = SmartLinkTheme.Link,
  url,
}) => (
  <a
    css={getStyles(size, theme, getMaxLines(maxLines))}
    href={url}
    data-smart-element-link
    data-testid={testId}
  >
    {text}
  </a>
);

export default Link;
