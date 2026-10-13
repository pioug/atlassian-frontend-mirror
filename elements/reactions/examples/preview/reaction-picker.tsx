import React from 'react';

import { IntlProvider } from 'react-intl';

import { type EmojiProvider } from '@atlaskit/emoji/emoji-resource';
import { ReactionPicker } from '@atlaskit/reactions/ReactionPicker';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

export default function ReactionPickerPreview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<div data-testid="component-preview">
				<ReactionPicker
					emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
					onSelection={() => {}}
				/>
			</div>
		</IntlProvider>
	);
}
