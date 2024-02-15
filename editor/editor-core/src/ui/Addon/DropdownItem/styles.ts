import { css } from '@emotion/react';

import { N20, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const dropdownItem = css`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  padding: ${token('space.100', '8px')} ${token('space.400', '32px')}
    ${token('space.100', '8px')} ${token('space.150', '12px')};
  color: ${token('color.text', N800)};
  > span {
    display: flex;
    margin-right: ${token('space.100', '8px')};
  }
  &:hover {
    background-color: ${token('color.background.neutral.subtle.hovered', N20)};
  }
`;
