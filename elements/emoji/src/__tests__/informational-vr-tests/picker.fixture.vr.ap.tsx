import React, { useMemo } from 'react';
import { EmojiPicker } from '../../picker';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getMockEmojis } from '@atlaskit/editor-test-helpers/mock-emojis';
// eslint-disable-next-line import/no-extraneous-dependencies
import { currentUser, getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';

import type { EmojiProvider } from '../../resource';
import { IntlProvider } from 'react-intl';

setupEditorExperiments('test', {
	platform_teamoji_26_refresh_emoji_picker: false,
});

const useProvider = (uploadSupported: boolean) => {
	return useMemo<Promise<EmojiProvider>>(() => {
		return getEmojiProvider(
			{
				currentUser,
				uploadSupported,
			},
			getMockEmojis,
		);
	}, [uploadSupported]);
};

export const EmojiPickerWithUpload = (): React.JSX.Element => {
	const emojiProvider = useProvider(true);

	return (
		<IntlProvider locale="en">
			<EmojiPicker emojiProvider={emojiProvider} />
		</IntlProvider>
	);
};
