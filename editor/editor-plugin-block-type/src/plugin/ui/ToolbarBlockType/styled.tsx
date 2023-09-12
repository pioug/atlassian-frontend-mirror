/** @jsx jsx */
import { css } from '@emotion/react';

import { headingsSharedStyles } from '@atlaskit/editor-common/styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import { N400 } from '@atlaskit/theme/colors';
import type { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

export const blockTypeMenuItemStyle = (tagName: string, selected?: boolean) => {
  // TEMP FIX: See https://product-fabric.atlassian.net/browse/ED-13878
  const selectedStyle = selected
    ? `${tagName} { color: ${token('color.text', 'white')} !important; }`
    : '';

  return (themeProps: ThemeProps) => css`
    ${headingsSharedStyles(themeProps)};
    > {
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin-top: 0;
      }
    }
    ${selectedStyle};
  `;
};

export const keyboardShortcut = css`
  ${shortcutStyle}
  margin-left: ${token('space.200', '16px')};
`;

export const keyboardShortcutSelect = css`
  color: ${token('color.icon', N400)};
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

export const wrapperSmallStyle = css`
  margin-left: ${token('space.050', '4px')};
  min-width: 40px;
`;

export const expandIconWrapperStyle = css`
  margin-left: -8px;
`;
