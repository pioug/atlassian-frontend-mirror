import { useContext, useEffect, useState } from 'react';
import { EmojiContext } from '../context/EmojiContext';
import type { EmojiProvider, UploadingEmojiProvider } from '../resource';

const supportsUploadFeature = (
	emojiProvider: EmojiProvider,
): emojiProvider is UploadingEmojiProvider => {
	const emojiUploadProvider = emojiProvider as UploadingEmojiProvider;
	return (
		!!emojiUploadProvider.isUploadSupported &&
		!!emojiUploadProvider.uploadCustomEmoji &&
		!!emojiUploadProvider.prepareForUpload
	);
};

export const useEmoji = () => {
	const context = useContext(EmojiContext);

	// Hooks API
	const [isUploadSupported, setIsUploadSupported] = useState(false);

	if (!context) {
		throw new Error('useEmoji must be used within EmojiContext');
	}

	const { emojiProvider } = context.emoji;

	useEffect(() => {
		if (supportsUploadFeature(emojiProvider)) {
			const checkIfUploadIsSupported = async () => {
				try {
					const supported = await emojiProvider.isUploadSupported();
					setIsUploadSupported(supported);
				} catch (error) {
					return false;
				}
			};
			checkIfUploadIsSupported();
		}
	}, [emojiProvider]);

	return {
		emojiProvider,
		isUploadSupported,
	};
};
