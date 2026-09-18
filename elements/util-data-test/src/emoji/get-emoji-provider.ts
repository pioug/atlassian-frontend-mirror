import { EmojiRepository } from '@atlaskit/emoji/resource';
import type { EmojiProvider, EmojiServiceResponse } from '@atlaskit/emoji/types';
import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/utils';

import { loggedUser } from './logged-user';
import { MockEmojiResource } from './mock-emoji-resource';
import { type MockEmojiResourceConfig } from './types';

type DataFetch = () => Promise<EmojiServiceResponse>;

export const currentUser: {
	id: string;
} = {
	id: loggedUser,
};

/**
 * Loads the mock emoji dataset.
 *
 * The `import()` keeps the payload in a lazily-loaded chunk, so it is only downloaded when an
 * emoji provider is actually created.
 */
export const defaultFetch = async (): Promise<any> => {
	const emojiData = await import('../json-data/emoji-all.json');
	return emojiData?.default ?? emojiData;
};

export const getEmojiProvider = async function getEmojiProvider(
	config?: MockEmojiResourceConfig,
	fn: DataFetch = defaultFetch,
): Promise<EmojiProvider> {
	const response = await fn();
	const { emojis } = denormaliseEmojiServiceResponse(response);
	const repository = new EmojiRepository(emojis);
	return new MockEmojiResource(repository, config);
};
