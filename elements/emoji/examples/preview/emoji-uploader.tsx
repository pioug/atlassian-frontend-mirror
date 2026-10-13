import React from 'react';

import { EmojiUploader } from '@atlaskit/emoji/emoji-uploader';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

export default function EmojiUploaderPreview(): React.JSX.Element {
	return (
		<div data-testid="component-preview">
			<EmojiUploader emojiProvider={getEmojiResource({ uploadSupported: true })} />
		</div>
	);
}
