import { css } from '@emotion/react';
import { R75 } from '@atlaskit/theme/colors';
import {
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akEditorDeleteIconColor,
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedNodeClassName,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';
import type { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import {
  codeBlockSharedStyles,
  CodeBlockSharedCssClassName,
} from '@atlaskit/editor-common/styles';

const GutterDangerOverlay = () => css`
  &::after {
    height: 100%;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 24px;
    background-color: ${token('color.blanket.danger', 'none')};
  }
`;

export const codeBlockStyles = (props: ThemeProps) => css`
  .ProseMirror {
    ${codeBlockSharedStyles(props)}
  }

  .ProseMirror li {
    /* if same list item has multiple code blocks we need top margin for all but first */
    > .code-block {
      margin: ${blockNodesVerticalMargin} 0 0 0;
    }
    > .code-block:first-child,
    > .ProseMirror-gapcursor:first-child + .code-block {
      margin-top: 0;
    }

    > div:last-of-type.code-block {
      margin-bottom: ${blockNodesVerticalMargin};
    }
  }

  .ProseMirror .code-block.${akEditorSelectedNodeClassName}:not(.danger) {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }

  /* Danger when top level node */
  .ProseMirror .danger.code-block {
    box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px
      ${token('color.border.danger', akEditorDeleteBorder)};

    .${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER} {
      background-color: ${token('color.background.danger', R75)};
      color: ${token('color.text.danger', akEditorDeleteIconColor)};
      ${GutterDangerOverlay()};
    }

    .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT} {
      background-color: ${token(
        'color.blanket.danger',
        akEditorDeleteBackground,
      )};
    }
  }

  /* Danger when nested node */
  .ProseMirror .danger .code-block {
    .${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER} {
      background-color: ${token(
        'color.background.danger',
        'rgba(255, 143, 115, 0.5)',
      )};
      color: ${token('color.text.danger', akEditorDeleteIconColor)};
      ${GutterDangerOverlay()};
    }

    .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT} {
      background-color: ${token(
        'color.blanket.danger',
        'rgba(255, 189, 173, 0.5)',
      )};
    }
  }
`;
