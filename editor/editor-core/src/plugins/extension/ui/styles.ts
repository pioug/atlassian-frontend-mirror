import { css } from 'styled-components';

import {
  blockNodesVerticalMargin,
  akEditorSelectedBorderSize,
  akEditorDeleteBorder,
  akEditorDeleteBackground,
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

export const extensionStyles = css`
  .extensionView-content-wrap,
  .bodiedExtensionView-content-wrap {
    margin: ${blockNodesVerticalMargin} 0;

    &:first-of-type {
      margin-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }

    &:not(.danger).${akEditorSelectedNodeClassName} {
      & > span > .extension-container {
        ${getSelectionStyles([SelectionStyle.BoxShadow])}
      }
    }

    &.danger > span > .extension-container {
      box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
      background-color: ${akEditorDeleteBackground};
    }

    &.inline {
      word-wrap: break-all;
    }
  }

  .extensionView-content-wrap .extension-container {
    overflow: hidden;
  }
`;
