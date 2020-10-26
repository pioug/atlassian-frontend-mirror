import { css } from 'styled-components';

import {
  SelectionStyle,
  getSelectionStyles,
  akEditorDeleteBackgroundWithOpacity,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

export const UnsupportedSharedCssClassName = {
  BLOCK_CONTAINER: 'unsupportedBlockView-content-wrap',
  INLINE_CONTAINER: 'unsupportedInlineView-content-wrap',
};

const inlineUnsupportedSelector = `.${UnsupportedSharedCssClassName.INLINE_CONTAINER} > span`;
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
      border: ${akEditorSelectedBorderSize}px solid ${akEditorDeleteBorder};
      background-color: ${akEditorDeleteBackgroundWithOpacity};
    }
  }
`;
