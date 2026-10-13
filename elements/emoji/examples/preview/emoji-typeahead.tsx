import React from 'react';

import { IntlProvider } from 'react-intl';

import EmojiTypeAhead from '@atlaskit/emoji/emoji-type-ahead';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

export default function EmojiTypeAheadPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<EmojiTypeAhead emojiProvider={getEmojiResource()} query=":wave" onSelection={() => {}} />
			</div>
		</IntlProvider>
	);
}
