import React from 'react';
import { EmojiPicker } from '../src/picker';
import {
	ResourcedEmojiControl,
	getEmojiConfig,
	getRealEmojiProvider,
} from '../example-helpers/demo-resource-control';
import { onSelection } from '../example-helpers';
import { emojiPickerHeight } from '../src/util/constants';
import { IntlProvider } from 'react-intl-next';

export default function Example() {
	const emojiConfig = getEmojiConfig();
	const emojiProvider = getRealEmojiProvider();
	return (
		<IntlProvider locale="en">
			<ResourcedEmojiControl
				emojiConfig={emojiConfig}
				customEmojiProvider={emojiProvider}
				children={<EmojiPicker emojiProvider={emojiProvider} onSelection={onSelection} />}
				customPadding={emojiPickerHeight}
			/>
		</IntlProvider>
	);
}
