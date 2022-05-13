import { css } from '@emotion/react';

import { ruleSharedStyles } from '@atlaskit/editor-common/styles';
import {
  akEditorLineHeight,
  akEditorSelectedBorderColor,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

export const ruleStyles = (props: ThemeProps) => css`
  .ProseMirror {
    ${ruleSharedStyles(props)};

    hr {
      cursor: pointer;
      padding: 4px 0;
      margin: calc(${akEditorLineHeight}em - 4px) 0;
      background-clip: content-box;

      &.${akEditorSelectedNodeClassName} {
        outline: none;
        background-color: ${token(
          'color.border.selected',
          akEditorSelectedBorderColor,
        )};
      }
    }
  }
`;
