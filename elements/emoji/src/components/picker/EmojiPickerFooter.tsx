/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, type MemoExoticComponent } from 'react';
import { useIntl } from 'react-intl';
import { css, jsx } from '@compiled/react';
import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import { Box } from '@atlaskit/primitives/compiled';
import type { EmojiDescription } from '../../types';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';
import { AddOwnEmoji } from '../common/AddEmoji';

const emojiPickerFooter = css({
	flex: '0 0 auto',
});

const emojiPickerFooterWithTopShadow = css({
	borderTop: `${token('border.width.selected')} solid ${token('color.border')}`,
	boxShadow: `0px -1px 1px 0px ${token('color.border')}`,
});

const emojiPickerFooterWithTopShadowNew = css({
	borderTop: `${token('border.width')} solid ${token('color.border')}`,
});

const emojiPreviewContainerStyles = cssMap({
	emojiPreviewContainer: {
		paddingTop: token('space.025'),
		paddingRight: token('space.025'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.025'),
	},
});

export interface Props {
	onOpenUpload: () => void;
	selectedEmoji?: EmojiDescription;
	uploadEnabled: boolean;
}

export const emojiPickerFooterTestId = 'emoji-picker-footer';

const EmojiPickerFooter = ({ selectedEmoji, onOpenUpload, uploadEnabled }: Props): JSX.Element => {
	const intl = useIntl();
	return fg('platform_emoji_picker_refresh') ? (
		<div
			css={[emojiPickerFooter, emojiPickerFooterWithTopShadowNew]}
			data-testid={emojiPickerFooterTestId}
		>
			{selectedEmoji ? (
				<Box xcss={emojiPreviewContainerStyles.emojiPreviewContainer}>
					<EmojiPreviewComponent emoji={selectedEmoji} />
				</Box>
			) : (
				<AddOwnEmoji onOpenUpload={onOpenUpload} uploadEnabled={uploadEnabled} intl={intl} />
			)}
		</div>
	) : (
		<div
			css={[emojiPickerFooter, emojiPickerFooterWithTopShadow]}
			data-testid={emojiPickerFooterTestId}
		>
			{selectedEmoji && <EmojiPreviewComponent emoji={selectedEmoji} />}
		</div>
	);
};

const _default_1: MemoExoticComponent<
	({ selectedEmoji, onOpenUpload, uploadEnabled }: Props) => JSX.Element
> = memo(EmojiPickerFooter);
export default _default_1;
