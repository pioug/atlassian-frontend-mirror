import { css } from '@emotion/react';
import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import { token } from '@atlaskit/tokens';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

export const dateStyles = css`
  .${DateSharedCssClassName.DATE_CONTAINER} {
    .${DateSharedCssClassName.DATE_WRAPPER} {
      line-height: initial;
      cursor: pointer;
    }

    &.${akEditorSelectedNodeClassName} {
      .${DateSharedCssClassName.DATE_WRAPPER} > span {
        ${getSelectionStyles([SelectionStyle.BoxShadow])}
      }
    }
  }

  .danger {
    .${DateSharedCssClassName.DATE_CONTAINER}.${akEditorSelectedNodeClassName}
      .${DateSharedCssClassName.DATE_WRAPPER}
      > span {
      box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px
        ${token('color.border.danger', akEditorDeleteBorder)};
    }
  }
`;
