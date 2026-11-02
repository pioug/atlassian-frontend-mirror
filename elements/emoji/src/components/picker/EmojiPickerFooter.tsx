/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo, type MemoExoticComponent } from 'react';

import { css, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import type { EmojiDescription } from '../../types';
import { AddOwnEmoji } from '../common/AddEmoji';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';

const emojiPickerFooter = css({
	flex: '0 0 auto',
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
	return (
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
	);
};

const _default_1: MemoExoticComponent<
	({ selectedEmoji, onOpenUpload, uploadEnabled }: Props) => JSX.Element
> = memo(EmojiPickerFooter);
export default _default_1;
