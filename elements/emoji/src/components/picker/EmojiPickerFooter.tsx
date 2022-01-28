import classNames from 'classnames';
import React from 'react';
import { PureComponent } from 'react';
import { EmojiDescription } from '../../types';
import * as styles from './styles';
import EmojiPickerPreview from './EmojiPickerPreview';

export interface Props {
  selectedEmoji?: EmojiDescription;
  isUploading: boolean;
}

export default class EmojiPickerFooter extends PureComponent<Props, {}> {
  render() {
    const { selectedEmoji, isUploading } = this.props;

    const previewFooterClassnames = classNames([
      styles.emojiPickerFooter,
      styles.emojiPickerFooterWithTopShadow,
    ]);

    if (!selectedEmoji || isUploading) {
      return null;
    }

    return (
      <div className={previewFooterClassnames}>
        <EmojiPickerPreview emoji={selectedEmoji} />
      </div>
    );
  }
}
