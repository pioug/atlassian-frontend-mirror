/* eslint-disable @repo/internal/react/no-clone-element */
/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const bodyStyles = css({
  position: 'relative',
  border: 'none',
  '&:after': {
    position: 'absolute',
    boxShadow: `inset 0 -2px 0 0 ${token('color.border', '#eee')}`,
    content: "''",
    inset: 0,
    pointerEvents: 'none',
  },
});

/**
 * __TBody__
 * @primitive
 */
export const TBody: FC = ({ children }) => (
  <tbody css={bodyStyles}>{children}</tbody>
);

export default TBody;
