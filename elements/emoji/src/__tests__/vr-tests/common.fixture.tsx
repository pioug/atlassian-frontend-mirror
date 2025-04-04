/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { testingEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';

import EmojiDeletePreviewComponent from '../../components/common/EmojiDeletePreview';
import EmojiUploadPreviewComponent from '../../components/common/EmojiUploadPreview';
import EmojiUploadPicker from '../../components/common/EmojiUploadPicker';
import { type EmojiDescription, type ImageRepresentation } from '../../types';

const wrapperStyles = css({ width: '350px' });

export const EmojiDeletePreview = () => {
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

export const EmojiUploadPreview = () => {
	const blueStar = testingEmojis.emojis[2] as EmojiDescription;
	const imagePath = (blueStar.representation as ImageRepresentation).imagePath;

	return (
		<div css={wrapperStyles}>
			<EmojiUploadPreviewComponent
				name="test"
				previewImage={imagePath}
				onUploadCancelled={() => {}}
				onAddEmoji={() => {}}
			/>
		</div>
	);
};

export const EmojiUploadPickerWithoutName = () => {
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

export const EmojiUploadPickerWithName = () => {
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
