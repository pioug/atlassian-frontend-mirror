/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PureComponent } from 'react';
import { EmojiDescription, OnEmojiEvent } from '../../types';
import CachingEmoji from '../common/CachingEmoji';
import { emojiItem, emojiPickerRow } from './styles';
export interface Props {
  emojis: EmojiDescription[];
  title: string;
  showDelete: boolean;
  onSelected?: OnEmojiEvent;
  onMouseMove?: OnEmojiEvent;
  onDelete?: OnEmojiEvent;
}

export default class EmojiPickerEmojiRow extends PureComponent<Props, {}> {
  render() {
    const {
      emojis,
      onSelected,
      onMouseMove,
      title,
      showDelete,
      onDelete,
    } = this.props;

    return (
      <div css={emojiPickerRow}>
        {emojis.map((emoji) => {
          const { shortName, id } = emoji;
          const key = id ? `${id}-${title}` : `${shortName}-${title}`;

          return (
            <span css={emojiItem} key={key}>
              <CachingEmoji
                emoji={emoji}
                selectOnHover={true}
                onSelected={onSelected}
                onMouseMove={onMouseMove}
                showDelete={showDelete}
                onDelete={onDelete}
                placeholderSize={24}
                shouldBeInteractive
              />
            </span>
          );
        })}
      </div>
    );
  }
}
