import { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import {
  blockNodesVerticalMargin,
  akEditorTableCellMinWidth,
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akEditorDeleteIconColor,
  SelectionStyle,
  getSelectionStyles,
  akEditorCodeFontFamily,
  akEditorCodeBlockPadding,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

import { codeBlockClassNames } from './ui/class-names';

export const codeBlockStyles = css`
  .ProseMirror .code-block {
    background: ${themed({ light: colors.N20, dark: colors.DN50 })};
    font-family: ${akEditorCodeFontFamily};
    border-radius: ${borderRadius()}px;
    font-size: 14px;
    line-height: 24px;
    margin: ${blockNodesVerticalMargin} 0 0 0;
    counter-reset: line;
    display: flex;
    min-width: ${akEditorTableCellMinWidth}px;
    cursor: pointer;

    .${codeBlockClassNames.gutter} {
      background-color: ${themed({
        light: 'rgba(9, 30, 66, 0.04)',
        dark: colors.DN40,
      })};
      color: ${colors.N300};
      text-align: right;
      user-select: none;
      padding: ${akEditorCodeBlockPadding} 8px;
      border-radius: ${borderRadius()}px;
      font-size: 12px;
      line-height: 24px;

      span {
        display: block;

        &::before {
          counter-increment: line;
          content: counter(line);
          display: inline-block;
        }
      }
    }

    .${codeBlockClassNames.content} {
      color: ${themed({ light: colors.N800, dark: colors.DN500 })};
      border-radius: ${borderRadius()}px;
      padding: ${akEditorCodeBlockPadding} 16px;
      overflow: auto;
      display: flex;
      flex: 1;

      pre {
        width: 100%;
        cursor: text;
      }

      code {
        display: inline-block;
        min-width: 100%;
        tab-size: 4;
      }
    }

    /* We render this as a basic box in IE11 because it can't handle scrolling */
    &.ie11 {
      display: block;
      .${codeBlockClassNames.gutter} {
        display: none;
      }
      .${codeBlockClassNames.content} {
        display: block;
        overflow: visible;

        pre {
          width: auto;
        }
        code {
          display: inline;
        }
      }
    }
  }

  .ProseMirror li > .code-block {
    margin: 0;
  }

  .ProseMirror .code-block.${akEditorSelectedNodeClassName}:not(.danger) {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }

  /* Danger when top level node */
  .ProseMirror .danger.code-block {
    box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};

    .${codeBlockClassNames.gutter} {
      background-color: ${colors.R75};
      color: ${akEditorDeleteIconColor};
    }

    .${codeBlockClassNames.content} {
      background-color: ${akEditorDeleteBackground};
    }
  }

  /* Danger when nested node */
  .ProseMirror .danger .code-block {
    .${codeBlockClassNames.gutter} {
      background-color: rgba(255, 143, 115, 0.5);
      color: ${akEditorDeleteIconColor};
    }

    .${codeBlockClassNames.content} {
      background-color: rgba(255, 189, 173, 0.5);
    }
  }
`;
