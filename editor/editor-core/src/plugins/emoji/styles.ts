import { css } from '@emotion/react';
import { EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';
import {
  SelectionStyle,
  getSelectionStyles,
  akEditorSelectedNodeClassName,
} from '@atlaskit/editor-shared-styles';

export const emojiStyles = css`
  .${EmojiSharedCssClassName.EMOJI_CONTAINER} {
    display: inline-block;

    .${EmojiSharedCssClassName.EMOJI_NODE} {
      cursor: pointer;

      &.${EmojiSharedCssClassName.EMOJI_IMAGE} > span {
        /** needed for selection style to cover custom emoji image properly */
        display: flex;
      }
    }

    &.${akEditorSelectedNodeClassName} {
      .${EmojiSharedCssClassName.EMOJI_SPRITE},
        .${EmojiSharedCssClassName.EMOJI_IMAGE} {
        border-radius: 2px;
        ${getSelectionStyles([
          SelectionStyle.Blanket,
          SelectionStyle.BoxShadow,
        ])}
      }
    }
  }
`;
