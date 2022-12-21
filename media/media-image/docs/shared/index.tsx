import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { N40 } from '@atlaskit/theme/colors';

export const hrStyles = css`
  background: ${token('color.border', N40)};
  border: 0;
  height: 2px;
  margin-bottom: 3em;
  margin-top: 3em;
`;
