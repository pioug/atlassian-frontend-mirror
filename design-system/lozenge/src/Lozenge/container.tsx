/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { borderRadius } from '@atlaskit/theme/constants';

import { ThemeTokens } from '../theme';

interface ThemeTokensWithChildren extends ThemeTokens {
  children?: ReactNode;
  testId?: string;
}

const containerStyles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  maxWidth: '100%',
  padding: '2px 0 3px 0',
  borderRadius: borderRadius(),
  fontSize: '11px',
  fontWeight: 700,
  lineHeight: 1,
  textTransform: 'uppercase',
  verticalAlign: 'baseline',
});

/**
 * __Container__
 *
 * A container to wrap the Content
 */
const Container = ({
  backgroundColor,
  textColor,
  children,
  testId,
}: ThemeTokensWithChildren) => {
  return (
    <span
      style={{ backgroundColor, color: textColor }}
      css={containerStyles}
      data-testid={testId}
    >
      {children}
    </span>
  );
};

export default Container;
