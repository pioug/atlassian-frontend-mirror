import React, { useMemo } from 'react';

import { IntlProvider } from 'react-intl';

// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
import { getMockEmojis, getFallbackEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';

import { EmojiPicker } from '../../picker';
import type { EmojiProvider } from '../../resource';

const useProvider = (uploadSupported: boolean, useFallback: boolean = false) => {
	return useMemo<Promise<EmojiProvider>>(() => {
		return getEmojiProvider(
			{
				currentUser,
				uploadSupported,
			},
			useFallback ? getFallbackEmojis : getMockEmojis,
		);
	}, [uploadSupported, useFallback]);
};

export const EmojiPickerWithUpload = (): React.JSX.Element => {
	const emojiProvider = useProvider(true);

	return (
		<IntlProvider locale="en">
			<EmojiPicker emojiProvider={emojiProvider} />
		</IntlProvider>
	);
};

export const EmojiPickerWithoutUpload = (): React.JSX.Element => {
	const emojiProvider = useProvider(false);

	return (
		<IntlProvider locale="en">
			<EmojiPicker emojiProvider={emojiProvider} />
		</IntlProvider>
	);
};

export const EmojiPickerWithFallbackWithUpload = (): React.JSX.Element => {
	const emojiProvider = useProvider(true, true);

	return (
		<IntlProvider locale="en">
			<EmojiPicker emojiProvider={emojiProvider} />
		</IntlProvider>
	);
};

export const EmojiPickerWithFallbackWithoutUpload = (): React.JSX.Element => {
	const emojiProvider = useProvider(false, true);

	return (
		<IntlProvider locale="en">
			<EmojiPicker emojiProvider={emojiProvider} />
		</IntlProvider>
	);
};
