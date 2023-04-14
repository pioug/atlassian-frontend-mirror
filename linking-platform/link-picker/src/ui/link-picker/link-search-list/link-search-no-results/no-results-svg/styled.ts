import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

const HEIGHT = 120;

export const noResultsSVGStyles = css`
  height: ${HEIGHT}px;
  margin: 0 auto ${token('space.300', '24px')};
  display: block;
`;
