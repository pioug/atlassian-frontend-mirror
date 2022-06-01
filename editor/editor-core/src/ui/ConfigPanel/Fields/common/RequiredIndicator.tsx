import { css } from '@emotion/react';
import { R500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const requiredIndicator = css`
  color: ${token('color.text.danger', R500)};
`;
