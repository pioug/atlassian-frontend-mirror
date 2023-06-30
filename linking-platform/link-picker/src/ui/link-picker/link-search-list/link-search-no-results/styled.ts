import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export const emptyStateWrapperStyles = css`
  & p {
    margin: 0;
  }
`;

export const emptyStateNoResultsWrapper = css`
  min-height: ${token('space.200', '16px')};
`;
