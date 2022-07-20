import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { N500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

export const clearTextButtonStyles = css`
  padding: 0;
  margin-right: ${gridSize() / 2}px;
  color: ${token('color.icon.subtle', N500)};
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const fieldStyles = css`
  margin-bottom: ${gridSize() * 2}px;
`;
