import { css } from 'styled-components';
import { borderRadius } from '@atlaskit/theme';
import {
  akEditorSelectedBorder,
  akEditorSelectedBorderBoldSize,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-common';

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

    &.ProseMirror-selectednode:not(.danger) .extension-container {
      border-radius: ${borderRadius}px;
      box-shadow: 0 0 0 ${akEditorSelectedBorderBoldSize}px
        ${akEditorSelectedBorder};
    }
  }

  .extensionView-content-wrap .extension-container {
    overflow: hidden;
  }
`;
