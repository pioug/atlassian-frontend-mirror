/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { testingEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';

import CompiledEmojiDeletePreview from '../../components/compiled/common/EmojiDeletePreview';
import CompiledEmojiUploadPreview from '../../components/compiled/common/EmojiUploadPreview';
import CompiledEmojiUploadPicker from '../../components/compiled/common/EmojiUploadPicker';
import EmotionEmojiDeletePreview from '../../components/common/EmojiDeletePreview';
import EmotionEmojiUploadPreview from '../../components/common/EmojiUploadPreview';
import EmotionEmojiUploadPicker from '../../components/common/EmojiUploadPicker';
import { type EmojiDescription, type ImageRepresentation } from '../../types';

const wrapperStyles = css({ width: '350px' });

export const EmojiDeletePreviewCompiled = () => {
	const blueStar = testingEmojis.emojis[2] as EmojiDescription;
	return (
		<div css={wrapperStyles}>
			<CompiledEmojiDeletePreview
				emoji={blueStar!}
				onCloseDelete={() => {}}
				onDeleteEmoji={() => Promise.resolve(false)}
			/>
		</div>
	);
};

export const EmojiDeletePreviewEmotion = () => {
	const blueStar = testingEmojis.emojis[2] as EmojiDescription;
	return (
		<div css={wrapperStyles}>
			<EmotionEmojiDeletePreview
				emoji={blueStar!}
				onCloseDelete={() => {}}
				onDeleteEmoji={() => Promise.resolve(false)}
			/>
		</div>
	);
};

export const EmojiUploadPreviewCompiled = () => {
	const blueStar = testingEmojis.emojis[2] as EmojiDescription;
	const imagePath = (blueStar.representation as ImageRepresentation).imagePath;

	return (
		<div css={wrapperStyles}>
			<CompiledEmojiUploadPreview
				name="test"
				previewImage={imagePath}
				onUploadCancelled={() => {}}
				onAddEmoji={() => {}}
			/>
		</div>
	);
};

export const EmojiUploadPreviewEmotion = () => {
	const blueStar = testingEmojis.emojis[2] as EmojiDescription;
	const imagePath = (blueStar.representation as ImageRepresentation).imagePath;

	return (
		<div css={wrapperStyles}>
			<EmotionEmojiUploadPreview
				name="test"
				previewImage={imagePath}
				onUploadCancelled={() => {}}
				onAddEmoji={() => {}}
			/>
		</div>
	);
};

export const EmojiUploadPickerCompiled = () => {
	return (
		<div css={wrapperStyles}>
			<CompiledEmojiUploadPicker
				onUploadCancelled={() => {}}
				onUploadEmoji={() => {}}
				initialUploadName={undefined}
			/>
		</div>
	);
};

export const EmojiUploadPickerEmotion = () => {
	return (
		<div css={wrapperStyles}>
			<EmotionEmojiUploadPicker
				onUploadCancelled={() => {}}
				onUploadEmoji={() => {}}
				initialUploadName={undefined}
			/>
		</div>
	);
};

export const EmojiUploadPickerWithNameCompiled = () => {
	return (
		<div css={wrapperStyles}>
			<CompiledEmojiUploadPicker
				onUploadCancelled={() => {}}
				onUploadEmoji={() => {}}
				initialUploadName="new_emoji"
			/>
		</div>
	);
};

export const EmojiUploadPickerWithNameEmotion = () => {
	return (
		<div css={wrapperStyles}>
			<EmotionEmojiUploadPicker
				onUploadCancelled={() => {}}
				onUploadEmoji={() => {}}
				initialUploadName="new_emoji"
			/>
		</div>
	);
};
