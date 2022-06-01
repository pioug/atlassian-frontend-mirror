import { css } from '@emotion/react';

import {
  SelectionStyle,
  getSelectionStyles,
  akEditorDeleteBackgroundWithOpacity,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const UnsupportedSharedCssClassName = {
  BLOCK_CONTAINER: 'unsupportedBlockView-content-wrap',
  INLINE_CONTAINER: 'unsupportedInlineView-content-wrap',
};

const inlineUnsupportedSelector = `.${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span:nth-of-type(2)`;
const blockUnsupportedSelector = `.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} > div`;

export const unsupportedStyles = css`
  ${blockUnsupportedSelector}, ${inlineUnsupportedSelector} {
    cursor: pointer;
  }

  .${akEditorSelectedNodeClassName}${blockUnsupportedSelector},
    .${akEditorSelectedNodeClassName}${inlineUnsupportedSelector} {
    ${getSelectionStyles([SelectionStyle.Background, SelectionStyle.Border])}
  }

  .danger {
    .${akEditorSelectedNodeClassName}${blockUnsupportedSelector},
      .${akEditorSelectedNodeClassName}${inlineUnsupportedSelector} {
      border: ${akEditorSelectedBorderSize}px solid
        ${token('color.border.danger', akEditorDeleteBorder)};
      background-color: ${token(
        'color.blanket.danger',
        akEditorDeleteBackgroundWithOpacity,
      )};
    }
  }
`;
