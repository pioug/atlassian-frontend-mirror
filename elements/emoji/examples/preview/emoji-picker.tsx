import React from 'react';

import { IntlProvider } from 'react-intl';

import { EmojiPicker } from '@atlaskit/emoji/emoji-picker';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

export default function EmojiPickerPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<EmojiPicker emojiProvider={getEmojiResource()} onSelection={() => {}} />
			</div>
		</IntlProvider>
	);
}
