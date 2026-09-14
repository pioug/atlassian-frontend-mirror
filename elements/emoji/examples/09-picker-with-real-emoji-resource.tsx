import React from 'react';

import { IntlProvider } from 'react-intl';

import { getEmojiConfig } from '../example-helpers/get-emoji-config';
import { getRealEmojiProvider } from '../example-helpers/get-real-emoji-provider';
import { onSelection } from '../example-helpers/on-selection';
import { ResourcedEmojiControl } from '../example-helpers/resourced-emoji-control';
import { EmojiPicker } from '../src/picker';
import { emojiPickerHeight } from '../src/util/constants';

export default function Example(): React.JSX.Element {
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
