/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { testingEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';

import EmojiDeletePreviewComponent from '../../components/common/EmojiDeletePreview';
import EmojiUploadPicker from '../../components/common/EmojiUploadPicker';
import { type EmojiDescription } from '../../types';

const wrapperStyles = css({ width: '350px' });

export const EmojiDeletePreview = (): JSX.Element => {
	const blueStar = testingEmojis.emojis[2] as EmojiDescription;
	return (
		<div css={wrapperStyles}>
			<EmojiDeletePreviewComponent
				emoji={blueStar!}
				onCloseDelete={() => {}}
				onDeleteEmoji={() => Promise.resolve(false)}
			/>
		</div>
	);
};

export const EmojiUploadPickerWithoutName = (): JSX.Element => {
	return (
		<div css={wrapperStyles}>
			<EmojiUploadPicker
				onUploadCancelled={() => {}}
				onUploadEmoji={() => {}}
				initialUploadName={undefined}
			/>
		</div>
	);
};

export const EmojiUploadPickerWithName = (): JSX.Element => {
	return (
		<div css={wrapperStyles}>
			<EmojiUploadPicker
				onUploadCancelled={() => {}}
				onUploadEmoji={() => {}}
				initialUploadName="new_emoji"
			/>
		</div>
	);
};
