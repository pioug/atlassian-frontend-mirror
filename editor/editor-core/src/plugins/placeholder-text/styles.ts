import { css } from '@emotion/react';
import { N300 } from '@atlaskit/theme/colors';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

export const placeholderTextStyles = css`
  .ProseMirror span[data-placeholder] {
    color: ${token('color.text.subtlest', N300)};
    display: inline;
  }

  .ProseMirror span.pm-placeholder {
    display: inline;
    color: ${token('color.text.subtlest', N300)};
  }
  .ProseMirror span.pm-placeholder__text {
    display: inline;
    color: ${token('color.text.subtlest', N300)};
  }

  .ProseMirror span.pm-placeholder.${akEditorSelectedNodeClassName} {
    ${getSelectionStyles([SelectionStyle.Background])}
  }

  .ProseMirror span.pm-placeholder__text[data-placeholder]::after {
    color: ${token('color.text.subtlest', N300)};
    cursor: text;
    content: attr(data-placeholder);
    display: inline;
  }
`;
