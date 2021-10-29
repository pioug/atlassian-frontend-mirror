/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

const rowPlaceholderStyles = css({
  padding: 0,
});

export const RowPlaceholderCell: FC = (props) => (
  <td css={rowPlaceholderStyles} {...props} />
);
