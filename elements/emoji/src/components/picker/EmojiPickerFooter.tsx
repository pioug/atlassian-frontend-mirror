/** @jsx jsx */
import { memo } from 'react';
import { jsx } from '@emotion/react';
import type { EmojiDescription } from '../../types';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';
import { emojiPickerFooter, emojiPickerFooterWithTopShadow } from './styles';

export interface Props {
  selectedEmoji?: EmojiDescription;
}

const previewFooterClassnames = [
  emojiPickerFooter,
  emojiPickerFooterWithTopShadow,
];

export const emojiPickerFooterTestId = 'emoji-picker-footer';

const EmojiPickerFooter = ({ selectedEmoji }: Props) => (
  <div css={previewFooterClassnames} data-testid={emojiPickerFooterTestId}>
    {selectedEmoji && <EmojiPreviewComponent emoji={selectedEmoji} />}
  </div>
);

export default memo(EmojiPickerFooter);
