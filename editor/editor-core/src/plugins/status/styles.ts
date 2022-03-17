import { css } from '@emotion/react';

import {
  StatusSharedCssClassName,
  TableSharedCssClassName,
} from '@atlaskit/editor-common/styles';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorDeleteBackgroundWithOpacity,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

export const statusStyles = css`
  .${TableSharedCssClassName.TABLE_CELL_WRAPPER},
    .${TableSharedCssClassName.TABLE_HEADER_CELL_WRAPPER},
    [data-layout-section] {
    .${StatusSharedCssClassName.STATUS_CONTAINER} {
      max-width: 100%;
      line-height: 0;

      > span {
        width: 100%;
      }
    }
  }
  .${StatusSharedCssClassName.STATUS_CONTAINER} {
    > span {
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
