import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const WIDTH = 82;

export const errorStyles = css`
  width: ${WIDTH}px;
  margin: 0 auto ${token('space.300', '24px')};
  display: block;
`;
