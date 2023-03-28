/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const baseStyles = css({
  position: 'sticky',
  zIndex: 1,
  backgroundColor: token('elevation.surface', 'white'),
  border: 'none',
  borderBottom: `2px solid ${token('color.border', '#eee')}`,
  borderTop: '2px solid transparent',
  inset: 0,
});

/**
 * __THead__
 *
 * A primitive table head container. Applies the HTML native element with minimal styling.
 *
 * @primitive
 */
export const THead: FC<{ children?: ReactNode }> = ({ children }) => {
  return <thead css={baseStyles}>{children}</thead>;
};
