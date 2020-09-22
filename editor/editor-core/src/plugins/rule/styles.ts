import { css } from 'styled-components';

import { ruleSharedStyles } from '@atlaskit/editor-common';
import {
  akEditorLineHeight,
  akEditorSelectedBorderColor,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

export const ruleStyles = css`
  .ProseMirror {
    ${ruleSharedStyles};

    hr {
      cursor: pointer;
      padding: 4px 0;
      margin: calc(${akEditorLineHeight}em - 4px) 0;
      background-clip: content-box;

      &.${akEditorSelectedNodeClassName} {
        outline: none;
        background-color: ${akEditorSelectedBorderColor};
      }
    }
  }
`;
