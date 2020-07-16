import { css } from 'styled-components';
import { EmojiSharedCssClassName } from '@atlaskit/editor-common';
import { akEditorSelectedNodeClassName } from '../../styles';
import { getSelectionStyles } from '../selection/utils';
import { SelectionStyle } from '../selection/types';

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
