/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, type MemoExoticComponent } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { EmojiDescription } from '../../types';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';

const emojiPickerFooter = css({
	flex: '0 0 auto',
});

const emojiPickerFooterWithTopShadow = css({
	borderTop: `${token('border.width.selected')} solid ${token('color.border')}`,
	boxShadow: `0px -1px 1px 0px ${token('color.border')}`,
});

export interface Props {
	selectedEmoji?: EmojiDescription;
}

export const emojiPickerFooterTestId = 'emoji-picker-footer';

const EmojiPickerFooter = ({ selectedEmoji }: Props): JSX.Element => (
	<div
		css={[emojiPickerFooter, emojiPickerFooterWithTopShadow]}
		data-testid={emojiPickerFooterTestId}
	>
		{selectedEmoji && <EmojiPreviewComponent emoji={selectedEmoji} />}
	</div>
);

const _default_1: MemoExoticComponent<({ selectedEmoji }: Props) => JSX.Element> =
	memo(EmojiPickerFooter);
export default _default_1;
