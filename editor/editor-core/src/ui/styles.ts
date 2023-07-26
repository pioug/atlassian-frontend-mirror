import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

export { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
export { scrollbarStyles } from '@atlaskit/editor-shared-styles/scrollbar';

export const wrapperSmallStyle = css`
  margin-left: ${token('space.050', '4px')};
  min-width: 40px;
`;

export const expandIconWrapperStyle = css`
  margin-left: -8px;
`;

export const buttonContentStyle = css`
  display: flex;
  min-width: 80px;
  align-items: center;
  overflow: hidden;
  justify-content: center;
  flex-direction: column;
  padding: ${token('space.075', '6px')};
`;

export const buttonContentReducedSpacingStyle = css`
  padding: ${token('space.100', '8px')};
`;

export const clickSelectWrapperStyle = css`
  user-select: all;
`;

export const centeredToolbarContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
`;
