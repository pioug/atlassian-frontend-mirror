/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import {
  EmojiId,
  OnEmojiEvent,
  EmojiProvider,
  ResourcedEmoji,
} from '@atlaskit/emoji';
import { utils } from '../../shared';
import * as styles from './styles';

export const RENDER_BUTTON_TESTID = 'button-emoji-id';

export interface EmojiButtonProps {
  /**
   * identifier info for a given emoji
   */
  emojiId: EmojiId;
  /**
   * Async provider to fetch the emoji
   */
  emojiProvider: Promise<EmojiProvider>;
  /**
   * Event handler when a new emoji is selected
   */
  onClick: OnEmojiEvent;
}

/**
 * custom button to render the custom emoji selector inside the reaction picker
 */
export const EmojiButton: React.FC<EmojiButtonProps> = ({
  emojiId,
  onClick,
  emojiProvider,
}) => {
  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onClick && utils.isLeftClick(event)) {
      onClick(emojiId, undefined, event);
    }
  };

  return (
    <button
      data-testid={RENDER_BUTTON_TESTID}
      onClick={onButtonClick}
      title={emojiId.shortName}
      type="button"
      css={styles.emojiButtonStyle}
    >
      <ResourcedEmoji emojiProvider={emojiProvider} emojiId={emojiId} />
    </button>
  );
};
