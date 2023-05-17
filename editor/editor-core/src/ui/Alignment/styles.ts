import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

export const alignmentWrapper = css`
  padding: 0 ${token('space.100', '8px')};
  display: flex;
  flex-wrap: wrap;
  max-width: ${3 * 32}px;
`;
