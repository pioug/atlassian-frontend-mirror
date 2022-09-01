/** @jsx jsx */
import { css } from '@emotion/react';

import { N400 } from '@atlaskit/theme/colors';
import { ThemeProps } from '@atlaskit/theme/types';
import { headingsSharedStyles } from '@atlaskit/editor-common/styles';
import { shortcutStyle } from '../../../../ui/styles';
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
  margin-left: 16px;
`;

export const keyboardShortcutSelect = css`
  color: ${token('color.icon', N400)};
`;
