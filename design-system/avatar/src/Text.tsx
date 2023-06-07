/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { N200, N900 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const baseStyles = css({
  display: 'block',
  margin: token('space.0', '0px'),
  color: token('color.text', N900),
});
const truncateStyles = css({
  overflowX: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
const secondaryStyles = css({
  color: token('color.text.subtlest', N200),
  fontSize: '0.85em',
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
  <span
    css={[
      baseStyles,
      isSecondary && secondaryStyles,
      shouldTruncate && truncateStyles,
    ]}
  >
    {children}
  </span>
);

export default Text;
