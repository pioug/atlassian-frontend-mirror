/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

const rowPlaceholderStyles = css({
  padding: 0,
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const RowPlaceholderCell: FC = (props) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <td css={rowPlaceholderStyles} {...props} />
);
