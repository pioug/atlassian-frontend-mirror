/** @jsx jsx */
import { memo } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { EmojiDescription } from '../../types';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';
import { emojiPickerFooter, emojiPickerFooterWithTopShadow } from './styles';

export interface Props {
	selectedEmoji?: EmojiDescription;
}

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const previewFooterClassnames = [emojiPickerFooter, emojiPickerFooterWithTopShadow];

export const emojiPickerFooterTestId = 'emoji-picker-footer';

const EmojiPickerFooter = ({ selectedEmoji }: Props) => (
	<div css={previewFooterClassnames} data-testid={emojiPickerFooterTestId}>
		{selectedEmoji && <EmojiPreviewComponent emoji={selectedEmoji} />}
	</div>
);

export default memo(EmojiPickerFooter);
