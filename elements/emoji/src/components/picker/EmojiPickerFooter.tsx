/** @jsx jsx */
import { jsx } from '@emotion/core';
import { memo } from 'react';
import { EmojiDescription } from '../../types';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';
import { emojiPickerFooter, emojiPickerFooterWithTopShadow } from './styles';

export interface Props {
  selectedEmoji?: EmojiDescription;
}

const previewFooterClassnames = [
  emojiPickerFooter,
  emojiPickerFooterWithTopShadow,
];

const EmojiPickerFooter = ({ selectedEmoji }: Props) => (
  <div css={previewFooterClassnames} data-testid="emoji-picker-footer">
    {selectedEmoji && <EmojiPreviewComponent emoji={selectedEmoji} />}
  </div>
);

export default memo(EmojiPickerFooter);
