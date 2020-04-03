/** @jsx jsx */
import { ReactNode } from 'react';
import { jsx } from '@emotion/core';
import { borderRadius } from '@atlaskit/theme/constants';
import { ThemeTokens } from '../theme';

const BORDER_RADIUS = `${borderRadius()}px`;

interface ThemeTokensWithChildren extends ThemeTokens {
  children?: ReactNode;
  testId?: string;
}

export default ({
  backgroundColor,
  textColor,
  children,
  testId,
}: ThemeTokensWithChildren) => (
  <span
    css={{
      backgroundColor,
      borderRadius: BORDER_RADIUS,
      boxSizing: 'border-box',
      color: textColor,
      display: 'inline-block',
      fontSize: '11px',
      fontWeight: 700,
      lineHeight: 1,
      maxWidth: '100%',
      padding: '2px 0 3px 0',
      textTransform: 'uppercase',
      verticalAlign: 'baseline',
    }}
    data-testid={testId}
  >
    {children}
  </span>
);
