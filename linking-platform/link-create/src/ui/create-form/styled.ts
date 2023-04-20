import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const CREATE_FORM_MAX_WIDTH_IN_PX = '600';

export const formStyles = css`
  margin: 0 auto;
  max-width: ${CREATE_FORM_MAX_WIDTH_IN_PX}px;
  padding: 0 0 ${token('space.300', '24px')} 0;
`;
