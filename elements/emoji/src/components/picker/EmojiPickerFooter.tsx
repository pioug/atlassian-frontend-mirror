/** @jsx jsx */
import { jsx } from '@emotion/core';
import { PureComponent } from 'react';
import { EmojiDescription } from '../../types';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';
import { emojiPickerFooter, emojiPickerFooterWithTopShadow } from './styles';

export interface Props {
  selectedEmoji?: EmojiDescription;
  isUploading: boolean;
}

export default class EmojiPickerFooter extends PureComponent<Props, {}> {
  render() {
    const { selectedEmoji, isUploading } = this.props;

    const previewFooterClassnames = [
      emojiPickerFooter,
      emojiPickerFooterWithTopShadow,
    ];

    if (!selectedEmoji || isUploading) {
      return null;
    }

    return (
      <div css={previewFooterClassnames}>
        {selectedEmoji && <EmojiPreviewComponent emoji={selectedEmoji} />}
      </div>
    );
  }
}
