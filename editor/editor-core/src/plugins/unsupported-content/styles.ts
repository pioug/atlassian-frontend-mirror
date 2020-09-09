import { css } from 'styled-components';
import { akEditorSelectedNodeClassName } from '../../styles';
import { getSelectionStyles } from '../selection/utils';
import { SelectionStyle } from '../selection/types';

import {
  akEditorDeleteBackgroundWithOpacity,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
} from '@atlaskit/editor-common';

export const UnsupportedSharedCssClassName = {
  BLOCK_CONTAINER: 'unsupportedBlockView-content-wrap',
  INLINE_CONTAINER: 'unsupportedInlineView-content-wrap',
};

const inlineUnsupportedSelector = `.${UnsupportedSharedCssClassName.INLINE_CONTAINER} span span`;
const blockUnsupportedSelector = `.${UnsupportedSharedCssClassName.BLOCK_CONTAINER} div`;

export const unsupportedStyles = css`
  ${blockUnsupportedSelector},${inlineUnsupportedSelector} {
    cursor: pointer;
  }

  .${akEditorSelectedNodeClassName}${blockUnsupportedSelector},
    .${akEditorSelectedNodeClassName}${inlineUnsupportedSelector} {
    ${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.Border])}
  }

  .danger {
    .${akEditorSelectedNodeClassName}${blockUnsupportedSelector},
      .${akEditorSelectedNodeClassName}${inlineUnsupportedSelector} {
      border: ${akEditorSelectedBorderSize}px solid ${akEditorDeleteBorder};
      background-color: ${akEditorDeleteBackgroundWithOpacity};
      &::after {
        content: none; /* reset the Blanket selection style */
      }
    }
  }
`;
