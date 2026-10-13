import React from 'react';

import ResourcedEmoji from '@atlaskit/emoji/resourced-emoji';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

export default function ResourcedEmojiPreview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<ResourcedEmoji
				emojiId={{ id: '1f44b', shortName: ':wave:' }}
				emojiProvider={getEmojiResource()}
			/>
		</div>
	);
}
