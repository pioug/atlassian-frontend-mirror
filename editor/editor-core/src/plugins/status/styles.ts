import { css } from 'styled-components';

import { StatusSharedCssClassName } from '@atlaskit/editor-common';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorDeleteBackgroundWithOpacity,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

export const statusStyles = css`
  .${StatusSharedCssClassName.STATUS_CONTAINER} {
    // these two styles can be removed when displayInlineBlockForInlineNodes is enabled by default
    // as it will make all inline nodes inline-block by default
    display: inline-block;
    user-select: all;

    > span {
      display: inline-block;
      cursor: pointer;
      line-height: 0; /* Prevent responsive layouts increasing height of container. */
    }

    &.${akEditorSelectedNodeClassName}
      .${StatusSharedCssClassName.STATUS_LOZENGE}
      > span {
      ${getSelectionStyles([SelectionStyle.BoxShadow])}
    }
  }

  .danger {
    .${StatusSharedCssClassName.STATUS_LOZENGE} > span {
      background-color: ${akEditorDeleteBackgroundWithOpacity};
    }

    .${StatusSharedCssClassName.STATUS_CONTAINER}.${akEditorSelectedNodeClassName}
      .${StatusSharedCssClassName.STATUS_LOZENGE}
      > span {
      box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
    }
  }
`;
