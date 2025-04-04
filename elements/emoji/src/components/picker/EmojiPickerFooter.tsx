/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N30A } from '@atlaskit/theme/colors';
import type { EmojiDescription } from '../../types';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';

const emojiPickerFooter = css({
	flex: '0 0 auto',
});

const emojiPickerFooterWithTopShadow = css({
	borderTop: `2px solid ${token('color.border', N30A)}`,
	boxShadow: `0px -1px 1px 0px ${token('color.border', 'rgba(0, 0, 0, 0.1)')}`,
});

export interface Props {
	selectedEmoji?: EmojiDescription;
}

export const emojiPickerFooterTestId = 'emoji-picker-footer';

const EmojiPickerFooter = ({ selectedEmoji }: Props) => (
	<div
		css={[emojiPickerFooter, emojiPickerFooterWithTopShadow]}
		data-testid={emojiPickerFooterTestId}
	>
		{selectedEmoji && <EmojiPreviewComponent emoji={selectedEmoji} />}
	</div>
);

export default memo(EmojiPickerFooter);
