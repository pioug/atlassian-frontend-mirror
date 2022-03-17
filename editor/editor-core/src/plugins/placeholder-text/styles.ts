import { css } from '@emotion/react';
import { N300 } from '@atlaskit/theme/colors';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

export const placeholderTextStyles = css`
  .ProseMirror span[data-placeholder] {
    color: ${N300};
    display: inline;
  }

  .ProseMirror span.pm-placeholder {
    display: inline;
    color: ${N300};
  }
  .ProseMirror span.pm-placeholder__text {
    display: inline;
    color: ${N300};
  }

  .ProseMirror span.pm-placeholder.${akEditorSelectedNodeClassName} {
    ${getSelectionStyles([SelectionStyle.Background])}
  }

  .ProseMirror span.pm-placeholder__text[data-placeholder]::after {
    color: ${N300};
    cursor: text;
    content: attr(data-placeholder);
    display: inline;
  }
`;
