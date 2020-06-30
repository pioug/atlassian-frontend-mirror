import { css } from 'styled-components';

import {
  akEditorLineHeight,
  akEditorSelectedBorder,
  ruleSharedStyles,
} from '@atlaskit/editor-common';

import { akEditorSelectedNodeClassName } from '../../styles';

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
        background-color: ${akEditorSelectedBorder};
      }
    }
  }
`;
