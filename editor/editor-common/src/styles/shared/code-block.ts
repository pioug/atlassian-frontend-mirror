import { css } from '@emotion/react';

import {
  akEditorCodeFontFamily,
  akEditorLineHeight,
  akEditorTableCellMinWidth,
  blockNodesVerticalMargin,
  overflowShadow,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import {
  DN20,
  DN400,
  DN50,
  DN800,
  N20,
  N30,
  N400,
  N800,
} from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, fontSize, gridSize } from '@atlaskit/theme/constants';
import { ThemeProps } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

export const CodeBlockSharedCssClassName = {
  CODEBLOCK_CONTAINER: 'code-block',
  CODEBLOCK_START: 'code-block--start',
  CODEBLOCK_END: 'code-block--end',
  CODEBLOCK_LINE_NUMBER_GUTTER: 'line-number-gutter',
  CODEBLOCK_CONTENT: 'code-content',
  DS_CODEBLOCK: '[data-ds--code--code-block]',
};

export const codeBlockSharedStyles = (props: ThemeProps) => css`
  .${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER} {
    position: relative;
    background-color: ${themed({
      light: token('color.background.neutral', N20),
      dark: token('color.background.neutral', DN50),
    })(props)};
    border-radius: ${borderRadius()}px;
    counter-reset: line;
    display: flex;
    overflow-x: auto;

    background-image: ${overflowShadow({
      // TODO: https://product-fabric.atlassian.net/browse/DSP-4118
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      background: themed({ light: N20, dark: DN50 })(props),
      width: '8px',
    })};

    --ds--code--bg-color: transparent;

    background-repeat: no-repeat;
    background-attachment: local, scroll, scroll;
    background-size: 8px 100%, 8px 100%, 8px 100%;
    background-position: 100% 0, 100% 0, 0 0;
    font-family: ${akEditorCodeFontFamily};
    margin: ${blockNodesVerticalMargin} 0 0 0;
    min-width: ${akEditorTableCellMinWidth}px;
    cursor: pointer;

    .${CodeBlockSharedCssClassName.CODEBLOCK_START} {
      position: absolute;
      visibility: hidden;
      height: 1.5rem;
      top: 0px;
      left: 0px;
    }

    .${CodeBlockSharedCssClassName.CODEBLOCK_END} {
      position: absolute;
      visibility: hidden;
      height: 1.5rem;
      bottom: 0px;
      right: 0px;
    }

    .${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER} {
      flex-shrink: 0;
      text-align: right;
      background-color: ${themed({
        light: token('color.background.neutral', N30),
        dark: token('color.background.neutral', DN20),
      })(props)};
      padding: ${gridSize()}px;

      span {
        display: block;
        line-height: 0;
        font-size: 0;

        ::before {
          display: inline-block;
          content: counter(line);
          counter-increment: line;
          color: ${themed({
            light: token('color.text.subtlest', N400),
            dark: token('color.text.subtlest', DN400),
          })(props)};
          font-size: ${relativeFontSizeToBase16(fontSize())};
          line-height: 1.5rem;
        }
      }
    }

    .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT} {
      display: flex;
      flex: 1;

      code {
        flex-grow: 1;
        tab-size: 4;
        cursor: text;
        color: ${themed({
          light: token('color.text', N800),
          dark: token('color.text', DN800),
        })(props)};
        border-radius: ${borderRadius()}px;
        margin: ${gridSize()}px;
        white-space: pre;
        font-size: ${relativeFontSizeToBase16(fontSize())};
        line-height: 1.5rem;
      }
    }
  }
`;

export const codeBlockInListSafariFix = css`
  ::before {
    content: ' ';
    line-height: ${akEditorLineHeight};
  }

  > p:first-child,
  > .code-block:first-child,
  > .ProseMirror-gapcursor:first-child + .code-block {
    margin-top: -${akEditorLineHeight}em !important;
  }
`;
