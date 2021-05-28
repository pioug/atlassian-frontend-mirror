/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { FC, ReactNode } from 'react';

import { CSSObject, jsx } from '@emotion/core';

import { N200, N900 } from '@atlaskit/theme/colors';

const getStyles = (
  isSecondary: boolean | undefined,
  shouldTruncate: boolean,
): CSSObject => ({
  display: 'block',
  margin: 0,
  color: N900,

  ...(shouldTruncate && {
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),

  ...(isSecondary && {
    color: N200,
    fontSize: '0.85em',
  }),
});

/**
 * __Text__
 *
 * Text is used internally only.
 */
const Text: FC<{
  isSecondary?: boolean;
  children: ReactNode;
  shouldTruncate: boolean;
}> = ({ isSecondary, children, shouldTruncate }) => (
  <span css={getStyles(isSecondary, shouldTruncate)}>{children}</span>
);

export default Text;
