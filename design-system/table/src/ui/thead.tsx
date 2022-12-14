/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const baseStyles = css({
  position: 'sticky',
  zIndex: 1,
  backgroundColor: token('elevation.surface', 'white'),
  border: 'none',
  inset: 0,
  '&:after': {
    position: 'absolute',
    boxShadow: `inset 0 -2px 0 0 ${token('color.border', '#eee')}`,
    content: "''",
    inset: 0,
    pointerEvents: 'none',
  },
});

/**
 * __THead__
 *
 * A primitive table head container. Applies the HTML native element with minimal styling.
 *
 * @primitive
 */
export const THead: FC = ({ children }) => {
  return <thead css={baseStyles}>{children}</thead>;
};
