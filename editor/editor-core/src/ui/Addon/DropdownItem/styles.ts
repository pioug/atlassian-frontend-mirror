import { css } from '@emotion/react';
import { N800, N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const dropdownItem = css`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 32px 8px 12px;
  color: ${token('color.text', N800)};
  > span {
    display: flex;
    margin-right: 8px;
  }
  &:hover {
    background-color: ${token('color.background.neutral.subtle.hovered', N20)};
  }
`;
