import classNames from 'classnames';
import React from 'react';
import { PureComponent } from 'react';
import CachingEmoji from '../../components/common/CachingEmoji';
import { EmojiDescription } from '../../types';
import * as styles from '../common/styles';

export interface Props {
  emoji?: EmojiDescription;
}

export default class EmojiPickerPreview extends PureComponent<Props, {}> {
  renderEmojiPreview() {
    const { emoji } = this.props;

    if (emoji) {
      const previewClasses = classNames({
        [styles.preview]: true,
      });

      const previewTextClasses = classNames({
        [styles.previewText]: true,
        [styles.previewSingleLine]: !emoji.name,
      });

      return (
        <div className={previewClasses}>
          <span className={styles.previewImg}>
            <CachingEmoji emoji={emoji} />
          </span>
          <div className={previewTextClasses}>
            <span className={styles.name}>{emoji.name}</span>
            <span className={styles.shortName}>{emoji.shortName}</span>
          </div>
        </div>
      );
    }
  }

  render() {
    const sectionClasses = classNames([
      styles.emojiPreview,
      styles.emojiPreviewSection,
    ]);
    return <div className={sectionClasses}>{this.renderEmojiPreview()}</div>;
  }
}
