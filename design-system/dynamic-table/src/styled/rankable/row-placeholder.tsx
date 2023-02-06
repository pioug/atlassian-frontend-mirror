/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const rowPlaceholderStyles = css({
  padding: token('space.0', '0px'),
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const RowPlaceholderCell: FC = (props) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <td css={rowPlaceholderStyles} {...props} />
);
