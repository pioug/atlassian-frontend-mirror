import React from 'react';
import { PureComponent } from 'react';

import * as styles from './styles';
import { EmojiDescription, OnEmojiEvent } from '../../types';
import CachingEmoji from '../common/CachingEmoji';
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
      <div className={styles.emojiPickerRow}>
        {emojis.map((emoji) => {
          const { shortName, id } = emoji;
          const key = id ? `${id}-${title}` : `${shortName}-${title}`;

          return (
            <span className={styles.emojiItem} key={key}>
              <CachingEmoji
                emoji={emoji}
                selectOnHover={true}
                onSelected={onSelected}
                onMouseMove={onMouseMove}
                showDelete={showDelete}
                onDelete={onDelete}
                placeholderSize={24}
              />
            </span>
          );
        })}
      </div>
    );
  }
}
