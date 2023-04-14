import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { N500 } from '@atlaskit/theme/colors';

export const clearTextButtonStyles = css`
  padding: 0;
  margin-right: ${token('space.050', '4px')};
  color: ${token('color.icon.subtle', N500)};
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const fieldStyles = css`
  & + & {
    margin-top: ${token('space.200', '16px')};
  }
`;
