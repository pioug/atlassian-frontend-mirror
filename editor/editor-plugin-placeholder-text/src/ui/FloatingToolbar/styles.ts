import { css } from '@emotion/react';

import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const container = (height?: number) => css`
  border-radius: ${borderRadius()}px;
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 12px 24px -6px ${N50A}, 0 0 1px ${N60A}`,
  )};
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: ${token('space.050', '4px')} ${token('space.100', '8px')};
  background-color: ${token('color.background.input', N0)};
  ${height
    ? css`
        height: ${height}px;
      `
    : ''};
`;
