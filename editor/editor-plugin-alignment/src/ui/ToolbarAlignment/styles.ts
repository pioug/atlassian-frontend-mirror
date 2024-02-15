import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const triggerWrapper = css`
  display: flex;
`;

export const wrapper = css`
  display: flex;
  align-items: center;
  div {
    display: flex;
  }
`;

export const expandIconWrapper = css`
  margin-left: ${token('space.negative.100', '-8px')};
`;
