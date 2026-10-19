import React from 'react';

import { EmojiUploader } from '@atlaskit/emoji/emoji-uploader';
import type { EmojiProvider } from '@atlaskit/emoji/types';

// The host supplies an upload-capable provider after checking permissions and applying its upload policy.
export default function EmojiUploaderExample({
	emojiProvider,
}: {
	emojiProvider: Promise<EmojiProvider>;
}): React.JSX.Element {
	return <EmojiUploader emojiProvider={emojiProvider} />;
}
