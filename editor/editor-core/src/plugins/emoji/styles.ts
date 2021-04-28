import { css } from 'styled-components';
import { N0, N20, N900 } from '@atlaskit/theme/colors';
import {
  borderRadius,
  fontSizeSmall,
  gridSize,
} from '@atlaskit/theme/constants';
import { EmojiSharedCssClassName } from '@atlaskit/editor-common';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedNodeClassName,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';

export const emojiStyles = css`
  .${EmojiSharedCssClassName.EMOJI_CONTAINER} {
    .${EmojiSharedCssClassName.EMOJI_NODE} {
      cursor: pointer;

      &.${EmojiSharedCssClassName.EMOJI_IMAGE} > span {
        /** needed for selection style to cover custom emoji image properly */
        display: flex;
      }
    }

    &.${akEditorSelectedNodeClassName} {
      .${EmojiSharedCssClassName.EMOJI_SPRITE},
        .${EmojiSharedCssClassName.EMOJI_IMAGE}
        > span {
        border-radius: 2px;
        ${getSelectionStyles([
          SelectionStyle.Blanket,
          SelectionStyle.BoxShadow,
        ])}
      }
    }
  }
`;

const grid = gridSize() / 2;
const fontSize = fontSizeSmall();
const lineHeight = (4 * grid) / fontSize;
const maxWidth = 105 * grid; // ~420px
const leftAndRightTextPadding = 2 * grid;
const topAndBottomPadding = grid / 4;
const marginDistance = 2 * grid;

export const emojiStylesNext = css`
  .editor-emoji {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-repeat: none;
    background-size: contain;
    cursor: pointer;
    vertical-align: middle;

    &.editor-emoji-loading {
      border-radius: ${borderRadius()}px;
      background: ${N20};
    }

    &.editor-emoji-fallback {
      display: inline;
      background: transparent;
      vertical-align: baseline;
    }

    &.ProseMirror-selectednode:empty {
      outline: none;
    }

    &:not(.editor-emoji-fallback) {
      font-size: 0px;
    }

    &:not(.editor-emoji-fallback)::before {
      content: attr(data-emoji-shortname);
      display: block;
      box-sizing: border-box;
      width: auto;
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translate(-50%, ${marginDistance}px);

      // packages/css-packs/reduced-ui-pack/src/tooltip.js:25
      color: ${N0};
      background-color: ${N900};
      font-size: ${relativeFontSizeToBase16(fontSize)};
      line-height: ${lineHeight};
      max-width: ${maxWidth}px;
      border-radius: ${borderRadius()}px;
      overflow: hidden;
      padding: ${topAndBottomPadding}px ${leftAndRightTextPadding}px;
      pointer-events: none;
      position: absolute;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
      z-index: 10000;

      opacity: 0; // invisible by default
      transition: opacity 0.35s; // (durationStep * 14)
    }

    &:not(.editor-emoji-fallback):hover::before {
      opacity: 1;
      transition: opacity 0s 0.35s; // (durationStep * 14)
    }

    &.${akEditorSelectedNodeClassName} {
      z-index: 2;
      border-radius: 2px;
      ${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.BoxShadow])}
    }
  }
`;
