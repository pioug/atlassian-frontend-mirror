import type { EmojiProvider } from '@atlaskit/emoji';

import { createEmojiNodeDataProvider } from '../providers/emoji';

export function getConfluencePageProviders({
	emojiProvider,
}: {
	emojiProvider: Promise<EmojiProvider>;
}) {
	return {
		emoji: createEmojiNodeDataProvider({ emojiProvider }),
	};
}
