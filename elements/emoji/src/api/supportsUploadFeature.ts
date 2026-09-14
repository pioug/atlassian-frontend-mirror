import { type EmojiProvider, type UploadingEmojiProvider } from '../types';

/**
 * Checks if the emojiProvider can support uploading at a feature level.
 *
 * Follow this up with an isUploadSupported() check to see if the provider is actually
 * configured to support uploads.
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 */
export const supportsUploadFeature = (
	emojiProvider: EmojiProvider,
): emojiProvider is UploadingEmojiProvider => {
	const emojiUploadProvider = emojiProvider as UploadingEmojiProvider;
	return (
		!!emojiUploadProvider.isUploadSupported &&
		!!emojiUploadProvider.uploadCustomEmoji &&
		!!emojiUploadProvider.prepareForUpload
	);
};
