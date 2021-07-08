/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

import { ThemeTokens } from '../theme';

interface ThemeTokensWithChildren extends ThemeTokens {
  children?: ReactNode;
}

const contentStyles = css({
  display: 'inline-block',
  boxSizing: 'border-box',
  width: '100%',
  padding: `0 ${gridSize() / 2}px`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
});

/**
 * __Content__
 *
 * Content to be shown in a lozenge
 */
const Content = ({ maxWidth, children }: ThemeTokensWithChildren) => {
  return (
    <span style={{ maxWidth }} css={contentStyles}>
      {children}
    </span>
  );
};

export default Content;
